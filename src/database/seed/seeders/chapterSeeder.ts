/**
 * Chapter Seeder
 */

import * as mutations from '#database/mutations';
import * as queries from '#database/queries';
import type { SeedConfig } from '#database/seed/config';
import { ProgressTracker } from '#database/seed/logger';
import { BatchProcessor } from '#database/seed/utils/batchProcessor';
import { createSlug, extractChapterNumber, normalizeDate } from '#database/seed/utils/helpers';
import type { ChapterSeed } from '#lib/validations';
import { imageService } from '#services/imageService';

export class ChapterSeeder {
  private options: SeedConfig["options"];
  private comicCache = new Map<string, number>();
  private chapterCache = new Map<string, number>();
  private batchProcessor: BatchProcessor<ChapterSeed, void>;

  constructor(options: SeedConfig["options"]) {
    this.options = options;
    this.batchProcessor = new BatchProcessor<ChapterSeed, void>({
      batchSize: 50, // Reduced from 100
      concurrency: 2, // Reduced from 5 to prevent rate limiting
    });
  }

  async seed(chapters: ChapterSeed[]): Promise<void> {
    const tracker = new ProgressTracker("Chapters", chapters.length);

    await this.batchProcessor.process(chapters, async (chapterData) => {
      try {
        await this.processChapter(chapterData, tracker);
      } catch (error) {
        tracker.incrementError(`${chapterData.chaptername ?? chapterData.title}: ${error}`);
      }
    });

    tracker.complete();
  }

  private async processChapter(chapterData: ChapterSeed, tracker: ProgressTracker): Promise<void> {
    const comicId = await this.getComicId(chapterData);
    if (!comicId) {
      tracker.incrementSkipped("Comic not found");
      return;
    }

    const chapterTitle = chapterData.chaptername ?? chapterData.title ?? "Untitled Chapter";
    const chapterNumber = extractChapterNumber(chapterTitle);
    const chapterSlug = createSlug(chapterTitle);

    const existing = await queries.getChapterByComicAndNumber(comicId, chapterNumber);

    const pageImages: string[] = [];
    if (!this.options.skipImageDownload && chapterData.images) {
      const comicSlug = await this.getComicSlug(comicId);

      for (let index = 0; index < chapterData.images.length; index++) {
        const img = chapterData.images[index];
        const imageUrl = typeof img === "string" ? img : (img?.url ?? "");
        if (imageUrl) {
          try {
            const result = await imageService.processImageUrl(
              imageUrl,
              `comics/${comicSlug}/${chapterSlug}`
            );
            if (result && result !== "/placeholder-comic.jpg") {
              pageImages.push(result);
            }
          } catch (error) {
            // Silently skip - error already logged by imageService
          }
        }
      }
    }

    const chapterReleaseDate = normalizeDate(
      chapterData.releaseDate ?? chapterData.updated_at ?? chapterData.updatedAt
    );

    if (existing) {
      await mutations.updateChapter(existing.id, {
        title: chapterTitle,
        releaseDate: chapterReleaseDate,
      });

      tracker.incrementUpdated(chapterTitle);

      if (pageImages.length > 0) {
        await mutations.createChapterImages(
          pageImages.map((imageUrl, index) => ({
            chapterId: existing.id,
            imageUrl,
            pageNumber: index + 1,
          }))
        );
      }
    } else {
      const created = await mutations.createChapter({
        comicId,
        chapterNumber,
        title: chapterTitle,
        slug: chapterSlug,
        releaseDate: chapterReleaseDate,
      });

      tracker.incrementCreated(chapterTitle);

      const cacheKey = `${comicId}-${chapterNumber}`;
      if (created) {
        this.chapterCache.set(cacheKey, created.id);
      }

      if (created && pageImages.length > 0) {
        await mutations.createChapterImages(
          pageImages.map((imageUrl, index) => ({
            chapterId: created.id,
            imageUrl,
            pageNumber: index + 1,
          }))
        );
      }
    }
  }

  private async getComicId(chapterData: ChapterSeed): Promise<number | null> {
    const comicTitle = chapterData.comictitle ?? "";

    if (!comicTitle) {
      return null;
    }

    if (this.comicCache.has(comicTitle)) {
      return this.comicCache.get(comicTitle) ?? null;
    }

    const comicRecord = await queries.getComicByTitle(comicTitle);

    if (comicRecord) {
      this.comicCache.set(comicTitle, comicRecord.id);
      return comicRecord.id;
    }

    return null;
  }

  private async getComicSlug(comicId: number): Promise<string> {
    const comicRecord = await queries.getComic(comicId);

    if (!comicRecord) {
      return "unknown";
    }

    return comicRecord.slug ?? createSlug(comicRecord.title);
  }
}
