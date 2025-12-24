import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const mutationsDir = './src/database/mutations';
const files = readdirSync(mutationsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = join(mutationsDir, file);
  let content = readFileSync(filePath, 'utf-8');
  const updated = content.replace(/from "@\/database\/db"/g, 'from "#db"');
  if (content !== updated) {
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`Updated: ${file}`);
  }
}

console.log('Done!');
