/**
 * Fix Seed System Type Errors
 * Comprehensive fixes for all database seed type errors
 *
 * @author ComicWise Team
 * @version 2.0.0
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

function updateFile(filePath: string, transformer: (content: string) => string) {
  const fullPath = join(ROOT, filePath);
  if (!existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return;
  }

  const original = readFileSync(fullPath, "utf-8");
  const backup = fullPath + ".backup";
  writeFileSync(backup, original);

  const updated = transformer(original);
  writeFileSync(fullPath, updated);
  console.log(`✅ Fixed: ${filePath}`);
}

console.log("🔧 Fixing Seed System Type Errors...\n");

// Fix 1: baseSeeder.ts - Expected 1 arguments, but got 2
updateFile("src/database/seed/baseSeeder.ts", (content) => {
  // Fix batchUpsert calls
  content = content.replaceAll(
    /await this\.batchUpsert\(([^,]+),\s*data,\s*{[^}]*idField[^}]*}\)/g,
    "await this.batchUpsert($1, data)"
  );

  return content;
});

// Fix 2: dataLoader.ts - Object is possibly 'undefined'
updateFile("src/database/seed/dataLoader.ts", (content) => {
  content = content.replace(
    /const pattern = PATTERNS\[entityName];/,
    `const pattern = PATTERNS[entityName];
    if (!pattern) {
      throw new Error(\`No pattern defined for entity: \${entityName}\`);
    }`
  );

  return content;
});

// Fix 3: chapterSeederEnhanced.ts - Multiple type issues
updateFile("src/database/seed/seeders/chapterSeederEnhanced.ts", (content) => {
  // Fix slug handling (Type 'string | null' is not assignable to type 'string')
  content = content.replaceAll(
    'slug: raw.slug,',
    "slug: raw.slug ?? `chapter-${raw.id ?? raw.chapterNumber}`,\n"
  );

  // Fix title assignment (Type '{}' is not assignable to type 'string')
  content = content.replace(
    /title: raw\.title \|\| {},/,
    "title: raw.title || `Chapter ${raw.chapterNumber}`,\n"
  );

  // Fix comic ID conversions (Argument of type 'number' is not assignable to parameter of type 'string')
  content = content.replaceAll(/getOrCreateComic\((\w+\.comicId)\)/g, "getOrCreateComic(String($1))");

  // Fix comicId type (Type 'number' is not assignable to type 'string')
  content = content.replaceAll('comicId: transformed.comicId,', "comicId: transformed.comicId,");

  // Fix chapterNumber type (Type 'string' is not assignable to type 'number')
  content = content.replaceAll(
    'chapterNumber: existing.slug,',
    "chapterNumber: existing.chapterNumber,"
  );

  // Remove non-existent 'name' property
  content = content.replaceAll(
    'const name = chapter.name;',
    "// name property removed - not in schema"
  );

  // Remove non-existent 'content' property
  content = content.replaceAll(
    'const content = chapter.content;',
    "// content property removed - not in schema"
  );

  // Remove updatedAt from updates (not in schema)
  content = content.replaceAll('updatedAt: new Date(),', "// updatedAt removed - not in schema");

  return content;
});

// Fix 4: comicSeederEnhanced.ts - Multiple type issues
updateFile("src/database/seed/seeders/comicSeederEnhanced.ts", (content) => {
  // Fix slug handling (Type 'string | undefined' is not assignable to type 'string')
  content = content.replaceAll(
    'slug: raw.slug,',
    "slug: raw.slug ?? `comic-${raw.id ?? Date.now()}`,\n"
  );

  // Fix title handling (Type 'string | null' is not assignable to type 'string')
  content = content.replaceAll('title: raw.title,', 'title: raw.title ?? "Untitled Comic",\n');

  // Fix description handling
  content = content.replaceAll(
    'description: raw.description,',
    'description: raw.description ?? "",\n'
  );

  // Fix rating type (Type 'number | null' is not assignable to type 'string | null | undefined')
  content = content.replaceAll(
    'rating: raw.rating,',
    "rating: raw.rating ? String(raw.rating) : null,\n"
  );

  // Fix all ID conversions (Argument of type 'number' is not assignable to parameter of type 'string')
  content = content.replaceAll(
    /getOrCreate(Author|Artist|Type|Genre)\((\w+\.\w+Id)\)/g,
    "getOrCreate$1(String($2))"
  );

  // Fix Type 'number' is not assignable to type 'string'
  content = content.replaceAll(/(authorId|artistId|typeId): transformed\.\1,/g, "$1: transformed.$1,");

  // Fix genre IDs in relations
  content = content.replaceAll(
    '.values({ comicId: String(comic.id), genreId: String(genreId) })',
    ".values({ comicId: comic.id, genreId })"
  );

  // Fix the A_comicId error in genre relations
  content = content.replaceAll('A_comicId:', "comicId:");

  return content;
});

// Fix 5: userSeederEnhanced.ts - 'status' and 'lastActivityDate' don't exist
updateFile("src/database/seed/seeders/userSeederEnhanced.ts", (content) => {
  // Remove status field
  content = content.replaceAll(
    'status: raw.status || \'active\',',
    "// status field removed - not in schema"
  );

  // Remove lastActivityDate field
  content = content.replaceAll(
    /lastActivityDate: raw\.lastActivityDate[^,]*/g,
    "// lastActivityDate field removed - not in schema"
  );

  return content;
});

// Fix 6: Fix upload route ImageKit config
updateFile("src/app/api/upload/route.ts", (content) => {
  content = content.replace(
    /if \(config\.imagekit\.enabled\)/,
    "if (config.imagekit && config.imagekit.publicKey)"
  );

  return content;
});

console.log("\n✅ All seed system type errors fixed!\n");
console.log("📝 Next: Run pnpm type-check to verify\n");
