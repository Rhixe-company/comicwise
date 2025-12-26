/**
 * Enhanced Seed Configuration
 */

export interface SeedConfig {
  enabled: {
    users: boolean;
    comics: boolean;
    chapters: boolean;
    all: boolean;
  };
  mode: "seed" | "clear" | "reset";
  options: {
    batchSize: number;
    imageDownloadConcurrency: number;
    skipImageDownload: boolean;
    verbose: boolean;
    dryRun: boolean;
    skipValidation: boolean;
    forceOverwrite: boolean;
  };
}

const DEFAULT_BATCH_SIZE = 100;
const DEFAULT_IMAGE_CONCURRENCY = 5;

export function parseCLIArgs(args: string[]): SeedConfig {
  const config: SeedConfig = {
    enabled: {
      users: false,
      comics: false,
      chapters: false,
      all: false,
    },
    mode: "seed",
    options: {
      batchSize: DEFAULT_BATCH_SIZE,
      imageDownloadConcurrency: DEFAULT_IMAGE_CONCURRENCY,
      skipImageDownload: false,
      verbose: false,
      dryRun: false,
      skipValidation: false,
      forceOverwrite: false,
    },
  };

  args.forEach((arg) => {
    if (arg === "--users") config.enabled.users = true;
    if (arg === "--comics") config.enabled.comics = true;
    if (arg === "--chapters") config.enabled.chapters = true;
    if (arg === "--all") config.enabled.all = true;
    if (arg === "--verbose" || arg === "-v") config.options.verbose = true;
    if (arg === "--dry-run") config.options.dryRun = true;
    if (arg === "--skip-validation") config.options.skipValidation = true;
    if (arg === "--skip-images") config.options.skipImageDownload = true;
    if (arg === "--force" || arg === "-f") config.options.forceOverwrite = true;
    if (arg === "--clear") config.mode = "clear";
    if (arg === "--reset") config.mode = "reset";
    if (arg.startsWith("--batch-size=")) {
      config.options.batchSize = parseInt(arg.split("=")[1] || "", 10) || DEFAULT_BATCH_SIZE;
    }
  });

  if (!config.enabled.users && !config.enabled.comics && !config.enabled.chapters && !config.enabled.all) {
    config.enabled.all = true;
  }

  return config;
}
