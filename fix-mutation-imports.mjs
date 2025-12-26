import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const mutationsDir = "./src";
const files = readdirSync(mutationsDir).filter((f) => f.endsWith(".ts"));

for (const file of files) {
  const filePath = join(mutationsDir, file);
  const content = readFileSync(filePath, "utf-8");
  const updated = content.replaceAll('from "@/database/db"', 'from "db"');
  if (content !== updated) {
    writeFileSync(filePath, updated, "utf-8");
    console.log(`Updated: ${file}`);
  }
}

console.log("Done!");
