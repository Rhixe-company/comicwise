# 🚀 ComicWise VS Code - Quick Reference Card (2025-12-26)

**Last Updated:** 2025-12-26  
**Version:** Enhanced Configuration v2.0

---

## ⚡ Quick Commands

### Essential Shortcuts

```
F5                  → Start Debugging (Full Stack)
Ctrl+Shift+P        → Command Palette
Ctrl+Shift+B        → Run Build Task
Ctrl+Shift+T        → Run Test Task
Ctrl+Shift+D        → Debug View
Ctrl+`              → Toggle Terminal
Ctrl+P              → Quick File Open
Ctrl+Shift+F        → Search in Files
Ctrl+Shift+H        → Replace in Files
Ctrl+,              → Settings
```

### Development Commands

```
pnpm dev            → Start dev server (Turbopack)
pnpm build          → Production build
pnpm test           → E2E tests (Playwright)
pnpm test:unit      → Unit tests (Vitest)
pnpm validate       → Type check + lint + format
pnpm db:studio      → Open Drizzle Studio
```

---

## 📊 Task Quick Launch

Press `Ctrl+Shift+P` → Type "Tasks: Run Task"

**Most Used:**

- `🚀 Dev Server` - Start development
- `✅ Validate All` - Full validation
- `🏗️ Build` - Production build
- `🗄️ Database: Studio` - Open DB UI
- `🧪 Test (Unit)` - Run Vitest
- `🐳 Docker: Up` - Start containers
- `🏥 Health: Check All` - Health check

---

## 🔧 Debug Configurations

Press `F5` or Debug view (`Ctrl+Shift+D`)

**Compounds (Favorites):**

1. 🚀 Full Stack: Dev + Debug + Health
2. 🔧 Dev + Debug + TypeScript Watch
3. 🧪 Full Test Suite
4. 🐳 Docker Dev Environment + Debug
5. ⚡ Complete CI Pipeline

**Individual:**

- Next: Dev Server
- Next: Dev with Inspect
- Vitest Unit Tests
- Playwright E2E
- Database: Studio
- TypeScript: Watch

---

## 🎨 Extensions Installed

**Critical:**

- ✅ ESLint
- ✅ Prettier
- ✅ TypeScript
- ✅ TailwindCSS
- ✅ Error Lens

**Testing:**

- ✅ Vitest Explorer
- ✅ Playwright

**Database:**

- ✅ PostgreSQL Client
- ✅ Redis for VS Code

**AI:**

- ✅ GitHub Copilot
- ✅ Copilot Chat
- ✅ Continue

**Git:**

- ✅ GitLens
- ✅ Git Graph

---

## 🤖 MCP Servers Active

**Core (Always On):**

- ✅ filesystem - File operations
- ✅ github - Repository management
- ✅ postgres - Database operations
- ✅ typescript - Type checking
- ✅ git - Version control

**Development:**

- ✅ next-devtools - Next.js tools
- ✅ shadcn - Components
- ✅ npm - Package management
- ✅ docker - Containers

**Testing:**

- ✅ playwright - E2E testing

**Utilities:**

- ✅ fetch - HTTP requests
- ✅ memory - AI memory
- ✅ sequential-thinking - AI reasoning
- ✅ time - Time utilities

**Optional (Disabled):**

- ⏸️ redis - Enable when needed
- ⏸️ brave-search - Requires API key

---

## 🎯 Common Workflows

### Start New Feature

```bash
1. Git branch: Ctrl+Shift+P → "Git: Create Branch"
2. Start dev: Task → "🚀 Dev Server"
3. Watch types: Debug → "TypeScript: Watch"
4. Code with Copilot enabled
5. Auto-format on save ✅
```

### Run Tests

```bash
1. Unit: Task → "🧪 Test (Unit Watch)"
2. E2E: Debug → "Playwright E2E"
3. Coverage: Task → "🧪 Test (Coverage)"
4. View results in terminal
```

### Database Work

```bash
1. Studio: Debug → "Database: Studio"
2. Seed: Task → "🗄️ Database: Seed"
3. Reset: Task → "🗄️ Database: Reset"
4. Migrate: Task → "🗄️ Database: Migrate"
```

### Build & Deploy

```bash
1. Validate: Task → "✅ Validate All"
2. Clean: Task → "🧹 Clean"
3. Build: Debug → "Next: Build"
4. Analyze: Debug → "Next: Build with Analysis"
```

---

## 📝 Format & Lint

**Auto-Format on Save:** ✅ Enabled

**Manual Format:**

```
Shift+Alt+F         → Format Document
Ctrl+K Ctrl+F       → Format Selection
```

**Lint:**

```
Task → "🎨 Lint (Fix)"  → Auto-fix all
```

**Organize Imports:**

```
Shift+Alt+O         → Organize Imports (auto on save)
```

---

## 🔍 Search & Navigation

**Find:**

```
Ctrl+F              → Find in file
Ctrl+H              → Replace in file
Ctrl+Shift+F        → Find in files
Ctrl+Shift+H        → Replace in files
```

**Navigate:**

```
Ctrl+P              → Go to file
Ctrl+Shift+O        → Go to symbol
F12                 → Go to definition
Alt+F12             → Peek definition
Shift+F12           → Find all references
```

**Path Aliases:**

```typescript
import {} from "@/..."; // src/
import {} from "lib/..."; // src/lib/
import {} from "components/..."; // src/components/
import {} from "ui/..."; // src/components/ui/
```

---

## 🐛 Debugging Tips

**Breakpoints:**

```
F9                  → Toggle breakpoint
Ctrl+Shift+F9       → Toggle conditional breakpoint
```

**Debug Controls:**

```
F5                  → Start/Continue
F10                 → Step Over
F11                 → Step Into
Shift+F11           → Step Out
Ctrl+Shift+F5       → Restart
Shift+F5            → Stop
```

**Debug Console:**

```
Ctrl+Shift+Y        → Open debug console
Type expressions to evaluate
```

---

## 💡 Pro Tips

### Performance

- **Memory:** 8GB allocated for dev, 6GB for build
- **Minimap:** Enabled but optimized
- **File Watchers:** Excludes node_modules, .next, dist
- **Auto-save:** 1 second delay

### Code Quality

- **ESLint:** Auto-fix on save ✅
- **Prettier:** Format on save ✅
- **Type Check:** Real-time with inlay hints ✅
- **Spell Check:** 60+ custom words ✅

### Productivity

- **Copilot:** Enabled for all files ✅
- **Auto-import:** Enabled ✅
- **Path intellisense:** Enabled ✅
- **Error Lens:** Inline diagnostics ✅

---

## 🔧 Customization

### Change Theme

```
Ctrl+K Ctrl+T       → Select Color Theme
Current: Default Dark+
```

### Change Icon Theme

```
Current: Material Icon Theme
Ctrl+Shift+P → "Preferences: File Icon Theme"
```

### Modify Settings

```
Ctrl+,              → Open Settings UI
Ctrl+Shift+P → "Preferences: Open Settings (JSON)"
Location: .vscode/settings.json
```

---

## 📦 File Locations

```
.vscode/
├── mcp.json          → MCP server config
├── extensions.json   → Extensions list
├── launch.json       → Debug configs
├── tasks.json        → Task runner
└── settings.json     → IDE settings

scripts/
├── optimize-vscode-complete.ps1
└── install-vscode-extensions-complete.ps1

Documentation:
├── VSCODE_OPTIMIZATION_COMPLETE.md
├── VSCODE_OPTIMIZATION_SUMMARY.md
└── VSCODE_QUICK_REFERENCE_2025-12-26.md (this file)
```

---

## 🆘 Troubleshooting

### Extensions Not Working?

```powershell
.\scripts\install-vscode-extensions-complete.ps1
```

### MCP Servers Not Starting?

```
1. Check VS Code Output → "MCP Servers"
2. Verify .env.local
3. Restart VS Code
```

### Format Not Working?

```
Ctrl+Shift+P → "Format Document With..."
Select "Prettier - Code formatter"
```

### IntelliSense Not Working?

```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📚 Documentation

- **Full Guide:** `VSCODE_OPTIMIZATION_COMPLETE.md`
- **Summary:** `VSCODE_OPTIMIZATION_SUMMARY.md`
- **This Card:** `VSCODE_QUICK_REFERENCE_2025-12-26.md`

---

## ✅ Verification Checklist

After restart, verify:

- [ ] MCP servers running (14 active)
- [ ] Extensions installed (59 total)
- [ ] Format on save working
- [ ] ESLint auto-fix working
- [ ] Copilot suggestions appearing
- [ ] Debug configs available (F5)
- [ ] Tasks available (Ctrl+Shift+P)
- [ ] Terminal opens correctly

---

**Quick Start:** Press `F5` → Select "🚀 Full Stack: Dev + Debug + Health"

**Need Help?** Check the full documentation files listed above.

**Happy Coding! 🚀**

---

_Last Updated: 2025-12-26 | ComicWise Project | Enhanced Configuration v2.0_
