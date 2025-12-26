/**
 * Comic Seeder
 */

import * as mutations from "@/database/mutations";
import * as queries from "@/database/queries";
import type { SeedConfig } from "@/database/seed/config";
import { ProgressTracker } from "@/database/seed/logger";
import { BatchProcessor } from "@/database/seed/utils/batchProcessor";
import { createSlug, normalizeDate, validateArray } from "@/database/seed/utils/helpers";
import type { MetadataCache } from "@/database/seed/utils/metadataCache";
import type { ComicSeed } from "@/lib/validations";
import { comicSeedSchema } from "@/lib/validations/index";
import { imageService } from "@/services/imageService";
import type { ComicStatus } from "@/typesdatabase";

/**
 *
 */
export class ComicSeeder {
  private metadataCache: MetadataCache;
  private options: SeedConfig["options"];
  private comicSlugCache = new Map<string, number>();
  private batchProcessor: BatchProcessor<ComicSeed, void>;

  /**
   *
   * param metadataCache
   * param options
   */
  constructor(metadataCache: MetadataCache, options: SeedConfig["options"]) {
    this.metadataCache = metadataCache;
    this.options = options;
    this.batchProcessor = new BatchProcessor<ComicSeed, void>({
      batchSize: 25, // Reduced from 50 to avoid overwhelming image service
      concurrency: 2, // Reduced from 3 to prevent rate limiting
    });
  }

  /**
   *
   * param comics
   */
  async seed(comics: ComicSeed[]): Promise<void> {
    // Validate data before processing
    const validatedComics = validateArray(comics, comicSeedSchema);

    const tracker = new ProgressTracker("Comics", validatedComics.length);

    await this.batchProcessor.process(validatedComics, async (comicData) => {
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
    const slug = comicData.slug ?? createSlug(comicData.title);

    const existing = await queries.getComicByTitle(comicData.title);

    let typeId: number | null = null;
    if (comicData.type || comicData.category) {
      const typeName =
        typeof comicData.type === "string"
          ? comicData.type
          : (comicData.type?.name ?? comicData.category!);
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

    let coverImage = existing?.coverImage ?? "/placeholder-comic.jpg";
    if (!this.options.skipImageDownload) {
      try {
        if (comicData.image_urls && comicData.image_urls.length > 0) {
          const result = await imageService.processImageUrl(
            comicData.image_urls[0],
            `comics/${slug}`
          );
          if (result && result !== "/placeholder-comic.jpg") {
            coverImage = result;
          }
        } else if (comicData.images && comicData.images.length > 0) {
          const firstImage = comicData.images[0];
          const imageUrl = typeof firstImage === "string" ? firstImage : (firstImage?.url ?? "");
          if (imageUrl) {
            const result = await imageService.processImageUrl(imageUrl, `comics/${slug}`);
            if (result && result !== "/placeholder-comic.jpg") {
              coverImage = result;
            }
          }
        }
      } catch (error) {
        // Silently use placeholder - error already logged by imageService
      }
    }

    const validStatuses: ComicStatus[] = [
      "Ongoing",
      "Hiatus",
      "Completed",
      "Dropped",
      "Coming Soon",
    ];
    const comicStatus: ComicStatus =
      comicData.status && validStatuses.includes(comicData.status as ComicStatus)
        ? (comicData.status as ComicStatus)
        : "Ongoing";

    let comicId: number;

    if (existing) {
      const updated = await mutations.updateComic(existing.id, {
        description: (comicData.description ?? existing.description ?? "").slice(0, 5000),
        coverImage,
        status: comicStatus,
        publicationDate: normalizeDate(
          comicData.publicationDate ?? comicData.updated_at ?? comicData.updatedAt
        ),
        authorId: authorId ?? undefined,
        artistId: artistId ?? undefined,
        typeId: typeId ?? undefined,
      });

      comicId = updated?.id ?? existing.id;
      this.comicSlugCache.set(slug, comicId);
      tracker.incrementUpdated(comicData.title);
    } else {
      const created = await mutations.createComic({
        title: comicData.title,
        slug,
        description: (comicData.description ?? "").slice(0, 5000),
        coverImage,
        status: comicStatus,
        publicationDate: normalizeDate(
          comicData.publicationDate ?? comicData.updated_at ?? comicData.updatedAt
        ),
        authorId: authorId ?? undefined,
        artistId: artistId ?? undefined,
        typeId: typeId ?? undefined,
        genreIds: [],
      });

      if (!created) {
        throw new Error(`Failed to create comic: ${comicData.title}`);
      }

      comicId = created.id;
      this.comicSlugCache.set(slug, comicId);
      tracker.incrementCreated(comicData.title);
    }

    if (comicData.genres && comicData.genres.length > 0) {
      const genreIds: number[] = [];
      for (const genreItem of comicData.genres) {
        const genreName = typeof genreItem === "string" ? genreItem : genreItem.name;
        const genreId = await this.metadataCache.getOrCreateGenre(genreName);
        genreIds.push(genreId);
      }
      if (genreIds.length > 0) {
        await mutations.updateComicGenres(comicId, genreIds);
      }
    }

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
      for (let index = 1; index < comicData.images.length; index++) {
        const img = comicData.images[index];
        const imageUrl = typeof img === "string" ? img : (img?.url ?? "");
        if (imageUrl) {
          imagesToProcess.push(imageUrl);
        }
      }
    }

    for (let index = 0; index < imagesToProcess.length; index++) {
      try {
        const result = await imageService.processImageUrl(
          imagesToProcess[index],
          `uploads/comics/${slug}`
        );
        if (result) {
          await mutations.createComicImage({
            comicId,
            imageUrl: result,
            imageOrder: index + 1,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.warn(`Failed to process additional image for ${comicData.title}: ${errorMessage}`);
      }
    }
  }

  /**
   *
   * param slug
   */
  getComicIdBySlug(slug: string): number | undefined {
    return this.comicSlugCache.get(slug);
  }
}
