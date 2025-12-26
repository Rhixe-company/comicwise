/**
 * Seed Configuration
 */

export interface SeedConfig {
  userFiles: string[];
  comicFiles: string[];
  chapterFiles: string[];
  enabled: {
    users: boolean;
    comics: boolean;
    chapters: boolean;
  };
  options: {
    batchSize: number;
    imageDownloadConcurrency: number;
    skipImageDownload: boolean;
    verbose: boolean;
    dryRun: boolean;
  };
}

export const defaultConfig: SeedConfig = {
  userFiles: ["./users.json"],
  comicFiles: ["./comics.json", "./comicsdata*.json"],
  chapterFiles: ["./chapters.json", "./chaptersdata*.json"],
  enabled: {
    users: true,
    comics: true,
    chapters: true,
  },
  options: {
    batchSize: 50,
    imageDownloadConcurrency: 5,
    skipImageDownload: false,
    verbose: false,
    dryRun: false,
  },
};

/**
 * Parse CLI arguments
 */
export function parseCLIArgs(args: string[]): SeedConfig {
  const config = JSON.parse(JSON.stringify(defaultConfig)) as SeedConfig;

  // Entity-specific flags
  if (args.includes("--users-only")) {
    config.enabled = { users: true, comics: false, chapters: false };
  } else if (args.includes("--comics-only")) {
    config.enabled = { users: false, comics: true, chapters: false };
  } else if (args.includes("--chapters-only")) {
    config.enabled = { users: false, comics: false, chapters: true };
  }

  if (args.includes("--no-users")) {
    config.enabled.users = false;
  }
  if (args.includes("--no-comics")) {
    config.enabled.comics = false;
  }
  if (args.includes("--no-chapters")) {
    config.enabled.chapters = false;
  }

  // Option flags
  if (args.includes("--skip-images")) {
    config.options.skipImageDownload = true;
  }
  if (args.includes("--verbose") || args.includes("-v")) {
    config.options.verbose = true;
  }
  if (args.includes("--dry-run")) {
    config.options.dryRun = true;
  }

  // Batch size
  const batchSizeIndex = args.indexOf("--batch-size");
  if (batchSizeIndex !== -1 && args[batchSizeIndex + 1]) {
    const size = parseInt(args[batchSizeIndex + 1]!, 10);
    if (!isNaN(size) && size > 0) {
      config.options.batchSize = size;
    }
  }

  // Image concurrency
  const imageConcurrencyIndex = args.indexOf("--image-concurrency");
  if (imageConcurrencyIndex !== -1 && args[imageConcurrencyIndex + 1]) {
    const concurrency = parseInt(args[imageConcurrencyIndex + 1]!, 10);
    if (!isNaN(concurrency) && concurrency > 0) {
      config.options.imageDownloadConcurrency = concurrency;
    }
  }

  return config;
}
