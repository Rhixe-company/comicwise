/**
 * Comic Seeder
 */

import { database } from "@/database";
import { comic, comicImage, comicToGenre } from "@/database/schema";
import { ProgressTracker } from "@/database/seed/logger";
import { BatchProcessor } from "@/database/seed/utils/batch-processor";
import { createSlug, normalizeDate } from "@/database/seed/utils/helpers";
import type { MetadataCache } from "@/database/seed/utils/metadata-cache";
import { eq } from "drizzle-orm";

import type { SeedConfig } from "@/database/seed/config";
import type { ComicSeed } from "@/lib/validations/seed";
import { imageService } from "@/services/image.service";

export class ComicSeeder {
  private metadataCache: MetadataCache;
  private options: SeedConfig["options"];
  private comicSlugCache = new Map<string, number>();
  private batchProcessor: BatchProcessor<ComicSeed, void>;

  constructor(metadataCache: MetadataCache, options: SeedConfig["options"]) {
    this.metadataCache = metadataCache;
    this.options = options;
    this.batchProcessor = new BatchProcessor<ComicSeed, void>({
      batchSize: 50,
      concurrency: 3,
    });
  }

  async seed(comics: ComicSeed[]): Promise<void> {
    const tracker = new ProgressTracker("Comics", comics.length);

    await this.batchProcessor.process(comics, async (comicData) => {
      try {
        await this.processComic(comicData, tracker);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        tracker.incrementError(`${comicData.title}: ${errorMessage}`);
      }
    });

    tracker.complete();
  }

  private async processComic(comicData: ComicSeed, tracker: ProgressTracker): Promise<void> {
    const slug = comicData.slug || createSlug(comicData.title);

    // Check if comic exists
    const existing = await database.query.comic.findFirst({
      where: eq(comic.title, comicData.title),
    });

    // Get or create metadata
    let typeId: number | null = null;
    if (comicData.type || comicData.category) {
      const typeName =
        typeof comicData.type === "string"
          ? comicData.type
          : comicData.type?.name || comicData.category!;
      typeId = await this.metadataCache.getOrCreateType(typeName);
    }

    let authorId: number | null = null;
    if (comicData.author && comicData.author !== "_") {
      const authorName =
        typeof comicData.author === "string" ? comicData.author : comicData.author.name;
      authorId = await this.metadataCache.getOrCreateAuthor(authorName);
    }

    let artistId: number | null = null;
    if (comicData.artist && comicData.artist !== "_") {
      const artistName =
        typeof comicData.artist === "string" ? comicData.artist : comicData.artist.name;
      artistId = await this.metadataCache.getOrCreateArtist(artistName);
    }

    // Process cover image
    let coverImage = existing?.coverImage || "/placeholder-comic.jpg";
    if (!this.options.skipImageDownload) {
      if (comicData.image_urls && comicData.image_urls.length > 0) {
        const result = await imageService.processImageUrl(
          comicData.image_urls[0],
          `comics/${slug}`
        );
        if (result) {
          coverImage = result;
        }
      } else if (comicData.images && comicData.images.length > 0) {
        const firstImage = comicData.images[0];
        const imageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url || "";
        if (imageUrl) {
          const result = await imageService.processImageUrl(imageUrl, `comics/${slug}`);
          if (result) {
            coverImage = result;
          }
        }
      }
    }

    const validStatuses = ["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"];
    const comicStatus =
      comicData.status && validStatuses.includes(comicData.status) ? comicData.status : "Ongoing";

    let comicId: number;

    if (existing) {
      // Update existing comic
      await database
        .update(comic)
        .set({
          description: (comicData.description || existing.description).slice(0, 5000),
          slug,
          coverImage,
          status: comicStatus,
          publicationDate: normalizeDate(
            comicData.publicationDate || comicData.updated_at || comicData.updatedAt
          ),
          rating: comicData.rating?.toString() || existing.rating,
          search_vector: existing.search_vector,
          authorId: authorId || existing.authorId,
          artistId: artistId || existing.artistId,
          typeId: typeId || existing.typeId,
          updatedAt: new Date(),
        })
        .where(eq(comic.id, existing.id));

      comicId = existing.id;
      this.comicSlugCache.set(slug, comicId);
      tracker.incrementUpdated(comicData.title);
    } else {
      // Create new comic
      const [created] = await database
        .insert(comic)
        .values({
          slug,
          title: comicData.title,
          description: (comicData.description || "").slice(0, 5000), // Limit description length
          coverImage,
          status: comicStatus,
          publicationDate: normalizeDate(
            comicData.publicationDate || comicData.updated_at || comicData.updatedAt
          ),
          rating: comicData.rating?.toString() || "0",
          views: 0,
          search_vector: "",
          authorId,
          artistId,
          typeId,
        })
        .returning();

      if (!created) {
        throw new Error(`Failed to create comic: ${comicData.title}`);
      }

      comicId = created.id;
      this.comicSlugCache.set(slug, comicId);
      tracker.incrementCreated(comicData.title);
    } // Process genres
    if (comicData.genres && comicData.genres.length > 0) {
      for (const genreItem of comicData.genres) {
        const genreName = typeof genreItem === "string" ? genreItem : genreItem.name;
        const genreId = await this.metadataCache.getOrCreateGenre(genreName);
        await database.insert(comicToGenre).values({ comicId, genreId }).onConflictDoNothing();
      }
    }

    // Process additional images
    if (!this.options.skipImageDownload) {
      await this.processAdditionalImages(comicData, comicId, slug);
    }
  }

  private async processAdditionalImages(
    comicData: ComicSeed,
    comicId: number,
    slug: string
  ): Promise<void> {
    const imagesToProcess: string[] = [];

    if (comicData.image_urls && comicData.image_urls.length > 1) {
      imagesToProcess.push(...comicData.image_urls.slice(1));
    } else if (comicData.images && comicData.images.length > 1) {
      for (let i = 1; i < comicData.images.length; i++) {
        const img = comicData.images[i];
        const imageUrl = typeof img === "string" ? img : img?.url || "";
        if (imageUrl) {
          imagesToProcess.push(imageUrl);
        }
      }
    }

    // Download images with concurrency control
    for (let i = 0; i < imagesToProcess.length; i++) {
      const result = await imageService.processImageUrl(imagesToProcess[i], `comics/${slug}`);
      if (result) {
        await database
          .insert(comicImage)
          .values({
            comicId,
            imageUrl: result,
            imageOrder: i + 1,
          })
          .onConflictDoNothing();
      }
    }
  }

  getComicIdBySlug(slug: string): number | undefined {
    return this.comicSlugCache.get(slug);
  }
}
