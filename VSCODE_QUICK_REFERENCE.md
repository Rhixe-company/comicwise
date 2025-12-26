# VSCode Configuration Quick Reference

## 🚀 Quick Start

```powershell
# 1. Validate configurations
.\scripts\manage-vscode-config.ps1 -Action validate

# 2. Install extensions
.\scripts\manage-vscode-config.ps1 -Action install-extensions

# 3. Restart VSCode
```

## 🎯 Launch Configurations (Press F5)

### Development
- **Full Stack Dev** - Dev server + auto-attach
- **Dev + Debug** - Dev with inspector on port 9229
- **Next: Dev Server** - Standard development server
- **TypeScript: Watch** - Type checking in watch mode

### Testing
- **Full Test Suite** - Vitest + Playwright
- **Vitest Unit Tests** - Run all unit tests
- **Playwright E2E** - Run E2E tests
- **Playwright UI Mode** - Interactive test mode

### Database
- **Database: Seed** - Seed database with test data
- **Database: Studio** - Open Drizzle Studio
- **Database: Reset** - Drop, recreate, and seed

### Production
- **Next: Build** - Production build
- **Next: Start Production** - Run production server

## 📋 Tasks (Ctrl+Shift+P → Tasks: Run Task)

### Common Tasks
- 🚀 **Dev Server** - Start development
- ✅ **Validate All** - Type + lint + format check
- 🏗️ **Build** - Production build
- 🧪 **Test (Unit)** - Run unit tests
- 🗄️ **Database: Studio** - Open database UI
- 🐳 **Docker: Up** - Start Docker services

## 🔌 MCP Servers

### Active Servers (13)
✅ filesystem - File operations  
✅ github - Repository management  
✅ postgres - Database queries  
✅ memory - AI context persistence  
✅ fetch - HTTP requests  
✅ shadcn - UI components  
✅ next-devtools - Next.js tools  
✅ npm - Package management  
✅ docker - Container management  
✅ git - Version control  
✅ playwright - E2E testing  
✅ sequential-thinking - AI reasoning  
✅ time - Timezone utilities  

### To Enable Optional Servers
Edit `.vscode/mcp.json` → Set `disabled: false`

## 🧩 Key Extensions

### Must-Have
- ESLint - Code linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind support
- Drizzle - Database management
- GitLens - Git supercharged

### Recommended
- Error Lens - Inline errors
- Pretty TypeScript Errors - Better TS errors
- GitHub Copilot - AI assistance
- REST Client - API testing
- Docker - Container management

## ⚙️ Settings Highlights

```json
{
  // Editor
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // Package Manager
  "npm.packageManager": "pnpm",
  
  // Performance
  "files.autoSave": "onFocusChange",
  "workbench.editor.limit.value": 10
}
```

## 🛠️ Management Script

```powershell
# All tasks
.\scripts\manage-vscode-config.ps1 -Action all

# Specific actions
.\scripts\manage-vscode-config.ps1 -Action validate
.\scripts\manage-vscode-config.ps1 -Action start-mcp
.\scripts\manage-vscode-config.ps1 -Action install-extensions
.\scripts\manage-vscode-config.ps1 -Action test-launch
.\scripts\manage-vscode-config.ps1 -Action optimize
.\scripts\manage-vscode-config.ps1 -Action help

# With verbose output
.\scripts\manage-vscode-config.ps1 -Action all -Verbose
```

## 🔑 Environment Variables (Optional)

For MCP servers that require authentication:

```env
# .env.local or system environment
GITHUB_TOKEN=ghp_xxxxx          # GitHub MCP
DATABASE_URL=postgresql://...   # Postgres MCP
REDIS_URL=redis://localhost     # Redis MCP (optional)
BRAVE_API_KEY=xxxxx            # Brave Search (optional)
EVERART_API_KEY=xxxxx          # EverArt (optional)
```

## 📊 Quick Commands

### VSCode Command Palette (Ctrl+Shift+P)
- `Tasks: Run Task` - Run a task
- `Debug: Select and Start Debugging` - Start debugging
- `Extensions: Install Extensions` - Install extensions
- `Preferences: Open Settings (JSON)` - Edit settings

### Terminal
```powershell
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Testing
pnpm test:unit              # Unit tests
pnpm test                   # E2E tests
pnpm validate               # Full validation

# Database
pnpm db:studio              # Open Drizzle Studio
pnpm db:seed                # Seed database
pnpm db:reset               # Reset database

# Docker
pnpm docker:up              # Start containers
pnpm docker:down            # Stop containers
pnpm docker:logs            # View logs

# Maintenance
pnpm clean                  # Clean build artifacts
pnpm cache:clear            # Clear cache
pnpm health:all             # Health check
```

## 🎯 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start Debugging | F5 |
| Run Task | Ctrl+Shift+P → Tasks |
| Terminal | Ctrl+` |
| Command Palette | Ctrl+Shift+P |
| Quick Open | Ctrl+P |
| Git Source Control | Ctrl+Shift+G |
| Extensions | Ctrl+Shift+X |
| Search | Ctrl+Shift+F |
| Debug Console | Ctrl+Shift+Y |

## 🔄 Common Workflows

### Starting Development
1. Open VSCode
2. Press F5 → Select "Full Stack Dev"
3. Wait for server to start
4. Browser opens automatically

### Running Tests
1. Ctrl+Shift+P
2. Type "Tasks: Run Task"
3. Select "🧪 Test (Unit)" or "🧪 Test (E2E)"

### Debugging
1. Set breakpoints (click line number)
2. Press F5
3. Select debug configuration
4. Debug console opens automatically

### Database Management
1. Ctrl+Shift+P
2. Type "Tasks: Run Task"
3. Select "🗄️ Database: Studio"
4. Browser opens with Drizzle Studio

## 📚 Full Documentation

See `VSCODE_CONFIGURATION_REPORT.md` for complete details.

## 🆘 Troubleshooting

**Extensions not installing?**
- Ensure `code` CLI is in PATH
- Run VSCode as administrator

**MCP servers not starting?**
- Check Node.js version (22+)
- Verify environment variables
- Check `.vscode/mcp-logs.txt`

**Tasks failing?**
- Verify pnpm is installed
- Check terminal output
- Ensure scripts exist in package.json

**Need help?**
```powershell
.\scripts\manage-vscode-config.ps1 -Action help
Get-Content .vscode\config-manager.log
```

---

**Quick Links:**
- [Full Report](./VSCODE_CONFIGURATION_REPORT.md)
- [Management Script](./scripts/manage-vscode-config.ps1)
- [Project README](./README.md)
