# 🚀 Enhanced Seeding System - Quick Reference

**Last Updated**: December 26, 2025

---

## ⚡ Quick Commands

```bash
# Seed everything
pnpm seed:enhanced

# Seed specific entities
pnpm seed:users
pnpm seed:comics
pnpm seed:chapters

# Database operations
pnpm seed:clear      # Clear all data
pnpm seed:reset      # Clear + reseed
pnpm seed:validate   # Test without inserting

# Advanced options
pnpm seed:enhanced --force --verbose
pnpm seed:enhanced --batch-size=500
pnpm seed:enhanced --dry-run
```

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/seed` | Validate data |
| POST | `/api/seed` | Seed entities |
| DELETE | `/api/seed` | Clear all data |
| PUT | `/api/seed` | Reset database |
| PATCH | `/api/seed` | Upsert data |

**Example Request**:
```typescript
fetch("/api/seed", {
  method: "POST",
  body: JSON.stringify({
    entities: "all",
    options: { batchSize: 100, verbose: true }
  })
});
```

---

## 📁 File Locations

```
src/database/seed/
├── runEnhanced.ts              # CLI entry point
├── seedHelpersEnhanced.ts      # Main functions
├── types.ts                    # Type definitions
├── dataLoader.ts               # JSON loader
├── baseSeeder.ts               # Base class
├── configEnhanced.ts           # Configuration
└── seeders/
    ├── userSeederEnhanced.ts
    ├── comicSeederEnhanced.ts
    └── chapterSeederEnhanced.ts

src/app/api/seed/route.ts       # REST API
```

---

## 🎯 JSON Files

Place your data files in:
```
./users.json
./comics.json
./comicsdata*.json
./chapters.json
./chaptersdata*.json
```

Or in subdirectories:
```
./data/users*.json
./seed-data/comics*.json
```

---

## ⚙️ Configuration

```typescript
interface SeedOptions {
  batchSize?: number;        // Default: 100
  verbose?: boolean;         // Default: false
  dryRun?: boolean;          // Default: false
  skipValidation?: boolean;  // Default: false
  forceOverwrite?: boolean;  // Default: false
  useTransaction?: boolean;  // Default: true
}
```

---

## 📊 Response Format

```json
{
  "success": true,
  "data": {
    "results": {
      "inserted": 100,
      "updated": 0,
      "skipped": 0,
      "errors": 0,
      "duration": 1234
    }
  }
}
```

---

## 🐛 Troubleshooting

**No data found?**
- Check file paths
- Verify JSON files exist
- Use `--verbose` flag

**Validation errors?**
- Run with `--dry-run --verbose`
- Check JSON format
- Review Zod schemas

**Duplicate errors?**
- Use `--force` to overwrite
- Check unique fields (email, slug)

---

## 📚 Full Documentation

- **README_ENHANCED.md** - Complete user guide
- **SEED_IMPLEMENTATION_SUMMARY.md** - Technical docs
- **SEED_SYSTEM_FINAL_REPORT.md** - Full report

---

**Need Help?** Check the comprehensive documentation above!
