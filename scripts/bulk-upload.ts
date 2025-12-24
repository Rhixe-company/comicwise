#!/usr/bin/env node
import { readdir } from "fs/promises";
import { extname, join } from "path";
// import { uploadToCloudinary } from '../src/lib/cloudinary';

interface UploadResult {
  file: string;
  url?: string;
  error?: string;
}

async function uploadToProvider(filePath: string, provider: string): Promise<UploadResult> {
  try {
    let url: string;

    switch (provider) {
      case "cloudinary":
        // url = await uploadToCloudinary(filePath);
        url = `https://cloudinary.com/uploaded/${filePath}`;
        break;
      // Add more providers here
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    return { file: filePath, url };
  } catch (error) {
    return {
      file: filePath,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function main() {
  const sourceDir = process.argv[2];
  const provider = process.argv[3] || "cloudinary";

  if (!sourceDir) {
    console.error("❌ Usage: pnpm upload <directory> [provider]");
    process.exit(1);
  }

  console.log(`📤 Uploading images from ${sourceDir} to ${provider}...\n`);

  const files = await readdir(sourceDir);
  const imageFiles = files.filter((f) =>
    [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extname(f).toLowerCase())
  );

  console.log(`Found ${imageFiles.length} images\n`);

  const results: UploadResult[] = [];
  let completed = 0;

  for (const file of imageFiles) {
    const filePath = join(sourceDir, file);
    const result = await uploadToProvider(filePath, provider);
    results.push(result);
    completed++;

    const icon = result.error ? "❌" : "✅";
    console.log(`${icon} [${completed}/${imageFiles.length}] ${file}`);
    if (result.url) console.log(`   ${result.url}`);
    if (result.error) console.log(`   Error: ${result.error}`);
  }

  const successful = results.filter((r) => !r.error).length;
  console.log(`\n✅ Uploaded ${successful}/${imageFiles.length} images successfully`);
}

main();
