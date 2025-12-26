# ComicWise CLI - Advanced Command Line Interface

A comprehensive CLI tool for managing all aspects of the ComicWise platform.

## Installation

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, or PowerShell profile)
alias cw='pnpm tsx cli/index.ts'

# Or use the wrapper scripts
chmod +x cli/cw.sh
alias cw='./cli/cw.sh'
```

## Quick Start

```bash
# Development
cw dev                    # Start development server
cw dev --turbo           # Dev with Turbopack

# Database
cw db migrate            # Run migrations
cw db seed               # Seed database
cw db backup             # Create backup
cw db studio             # Open Drizzle Studio

# Build & Deploy
cw build                 # Build for production
cw build --analyze       # Analyze bundle size
cw deploy vercel         # Deploy to Vercel

# Testing
cw test                  # Run all tests
cw test --watch          # Watch mode
cw test --coverage       # Generate coverage

# Cache Management
cw cache stats           # View statistics
cw cache clear "comic:*" # Clear by pattern
cw cache flush           # Flush all

# Queue Management
cw queue worker          # Start worker
cw queue stats           # View statistics
cw queue retry <id>      # Retry failed job

# Upload
cw upload bulk <path>    # Bulk upload images
cw upload test           # Test configuration

# Health & Monitoring
cw health                # Check all services
cw health db             # Check database
cw health redis          # Check Redis

# Scaffolding
cw scaffold component Button --type=client
cw scaffold page comics/[id]
cw scaffold action createComic
```

## Command Reference

### Build Commands

```bash
cw build                 # Build for production
cw build --analyze       # Analyze bundle size
cw build --profile       # Profile build performance
cw build analyze         # Detailed bundle analysis
```

### Database Commands

```bash
cw db migrate            # Run migrations
cw db seed               # Seed database
cw db seed --verbose     # Verbose output
cw db seed --users-only  # Seed users only
cw db seed --dry-run     # Preview without executing
cw db backup             # Create backup
cw db backup --output=<path>  # Custom output path
cw db restore <file>     # Restore from backup
cw db reset              # Reset database
cw db reset --force      # Skip confirmation
cw db studio             # Open Drizzle Studio
```

### Cache Commands

```bash
cw cache stats           # View statistics
cw cache keys            # List all keys
cw cache keys --pattern="comic:*"  # Filter keys
cw cache clear           # Clear all cache
cw cache clear "comic:*" # Clear by pattern
cw cache clear --tags=comics,chapters  # Clear by tags
cw cache flush           # Flush all cache
cw cache flush --force   # Skip confirmation
```

### Queue Commands

```bash
cw queue worker          # Start worker
cw queue worker --concurrency=10  # Set concurrency
cw queue stats           # View statistics
cw queue clear           # Clear queue
cw queue clear --status=completed  # Clear by status
cw queue retry           # Retry all failed
cw queue retry <id>      # Retry specific job
```

### Upload Commands

```bash
cw upload bulk <path>    # Bulk upload
cw upload bulk <path> --provider=cloudinary  # Specific provider
cw upload bulk <path> --dry-run  # Preview
cw upload bulk <path> --verbose  # Verbose output
cw upload bulk <path> --concurrency=10  # Set concurrency
cw upload test           # Test configuration
cw upload test --provider=imagekit  # Test specific provider
```

### Health Commands

```bash
cw health                # Check all services
cw health check          # Explicit check all
cw health db             # Check database
cw health redis          # Check Redis
cw health ci             # Check CI/CD status
```

### Scaffold Commands

```bash
# Components
cw scaffold component <name>
cw scaffold component <name> --type=client
cw scaffold component <name> --type=server

# Pages
cw scaffold page <path>
cw scaffold page comics/[id] --type=dynamic

# Server Actions
cw scaffold action <name>
cw scaffold action <name> --validation

# DTOs
cw scaffold dto <name>

# Tests
cw scaffold test <name>
cw scaffold test <name> --type=unit
```

## Tab Completion

### Bash/Zsh

Add to `~/.bashrc` or `~/.zshrc`:

```bash
source cli/completions/cw.bash
```

### PowerShell

Add to your PowerShell profile:

```powershell
. $PSScriptRoot\cli\completions\cw.ps1
```

## Environment Variables

All CLI commands respect environment variables from `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# Upload Providers
UPLOAD_PROVIDER=imagekit
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
```

## Configuration

CLI can be configured via `cli/config.json`:

```json
{
  "aliases": {
    "d": "dev",
    "b": "build",
    "t": "test"
  },
  "defaults": {
    "provider": "imagekit",
    "concurrency": 5,
    "verbose": false
  }
}
```

## Troubleshooting

### Command not found

```bash
# Ensure TypeScript CLI is available
pnpm install -g tsx

# Or use npx
npx tsx cli/index.ts <command>
```

### Permission denied

```bash
# Make wrapper executable
chmod +x cli/cw.sh

# On Windows, use PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module not found

```bash
# Reinstall dependencies
pnpm install

# Clear cache
pnpm store prune
pnpm install
```

## Examples

### Complete Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Setup database
cw db migrate
cw db seed

# 3. Start development
cw dev --turbo
```

### Production Deployment

```bash
# 1. Run checks
cw health
cw test

# 2. Build
cw build --analyze

# 3. Deploy
cw deploy vercel
```

### Bulk Upload Workflow

```bash
# 1. Test configuration
cw upload test --provider=cloudinary

# 2. Preview upload
cw upload bulk public/comics --dry-run

# 3. Execute upload
cw upload bulk public/comics --provider=cloudinary --verbose
```

### Cache Management

```bash
# View statistics
cw cache stats

# Clear specific patterns
cw cache clear "comic:*"
cw cache clear "chapter:*"

# Flush all (use with caution)
cw cache flush --force
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on adding new CLI
commands.

## License

MIT License - see [LICENSE](../LICENSE)
