#!/usr/bin/env node
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

// Fix all DAL files to use correct ID types (number instead of string)
async function fixDalFiles() {
  const dalDir = join(process.cwd(), "src", "dal");
  const files = await readdir(dalDir);

  for (const file of files) {
    if (!file.endsWith(".ts")) continue;

    const filePath = join(dalDir, file);
    let content = await readFile(filePath, "utf-8");

    // Replace string IDs with number IDs for entities that use serial IDs
    const serialIdEntities = ["artist", "author", "genre", "type", "comic", "chapter"];

    for (const entity of serialIdEntities) {
      if (file.toLowerCase().includes(entity.toLowerCase())) {
        // Replace id: string with id: number
        content = content.replaceAll('async findById(id: string)', "async findById(id: number)");
        content = content.replaceAll('async update(id: string,', "async update(id: number,");
        content = content.replaceAll('async delete(id: string)', "async delete(id: number)");

        // Remove slug-based methods for entities without slugs
        if (!["comic", "chapter"].includes(entity)) {
          content = content.replaceAll(/async findBySlug\(slug: string\)[^}]+}\s+}/gs, "");
        }
      }
    }

    await writeFile(filePath, content);
    console.log(`✅ Fixed ${file}`);
  }
}

fixDalFiles()
  .then(() => {
    console.log("\n✅ All DAL files fixed");
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
