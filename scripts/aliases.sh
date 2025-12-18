# Shell Aliases for ComicWise Scripts
# Add these to your ~/.bashrc, ~/.zshrc, or ~/.bash_profile

# ═══════════════════════════════════════════════════════════════════════════
# Development
# ═══════════════════════════════════════════════════════════════════════════
alias pd='pnpm dev'
alias pb='pnpm build'
alias ps='pnpm start'
alias pv='pnpm preview'

# ═══════════════════════════════════════════════════════════════════════════
# Database
# ═══════════════════════════════════════════════════════════════════════════
alias pdb='pnpm db:studio'
alias pdp='pnpm db:push'
alias pdr='pnpm db:reset'
alias pds='pnpm db:seed'
alias pdsn='pnpm db:seed --skip-images'
alias pdrh='pnpm db:reset:hard'

# ═══════════════════════════════════════════════════════════════════════════
# Testing
# ═══════════════════════════════════════════════════════════════════════════
alias pt='pnpm test'
alias ptu='pnpm test:unit'
alias ptw='pnpm test:unit:watch'
alias pti='pnpm test:ui'
alias ptd='pnpm test:debug'
alias ptc='pnpm test:unit:coverage'

# ═══════════════════════════════════════════════════════════════════════════
# Code Quality
# ═══════════════════════════════════════════════════════════════════════════
alias pl='pnpm lint'
alias plf='pnpm lint:fix'
alias pf='pnpm format'
alias ptc='pnpm type-check'
alias pval='pnpm validate'
alias pvalq='pnpm validate:quick'

# ═══════════════════════════════════════════════════════════════════════════
# Docker
# ═══════════════════════════════════════════════════════════════════════════
alias pdup='pnpm docker:up'
alias pddown='pnpm docker:down'
alias pddev='pnpm docker:dev'
alias pdlogs='pnpm docker:logs'
alias pdla='pnpm docker:logs:app'
alias pdldb='pnpm docker:logs:db'
alias pdsh='pnpm docker:shell'

# ═══════════════════════════════════════════════════════════════════════════
# Redis & Cache
# ═══════════════════════════════════════════════════════════════════════════
alias prs='pnpm redis:start'
alias prst='pnpm redis:stop'
alias prc='pnpm redis:cli'
alias pcc='pnpm cache:clear'
alias pcs='pnpm cache:stats'

# ═══════════════════════════════════════════════════════════════════════════
# Health & Monitoring
# ═══════════════════════════════════════════════════════════════════════════
alias phc='pnpm health:check'
alias pha='pnpm health:all'
alias phdb='pnpm health:db'
alias phr='pnpm health:redis'

# ═══════════════════════════════════════════════════════════════════════════
# Queue & Workers
# ═══════════════════════════════════════════════════════════════════════════
alias pqw='pnpm queue:worker'
alias pqd='pnpm queue:dashboard'
alias pqs='pnpm queue:stats'

# ═══════════════════════════════════════════════════════════════════════════
# Upload
# ═══════════════════════════════════════════════════════════════════════════
alias pub='pnpm upload:bulk'
alias pubd='pnpm upload:bulk:dry-run'
alias pubi='pnpm upload:bulk:imagekit'
alias pubc='pnpm upload:bulk:cloudinary'

# ═══════════════════════════════════════════════════════════════════════════
# Utilities
# ═══════════════════════════════════════════════════════════════════════════
alias pcl='pnpm clean'
alias pcla='pnpm clean:all'
alias pclc='pnpm clean:cache'
alias pup='pnpm update-deps'
alias paud='pnpm audit'

# ═══════════════════════════════════════════════════════════════════════════
# Compound Commands (Workflows)
# ═══════════════════════════════════════════════════════════════════════════

# Full development setup
alias psetup='pnpm install && pnpm db:push && pnpm db:seed && pnpm dev'

# Clean and rebuild
alias prefresh='pnpm clean:all && pnpm install && pnpm db:reset && pnpm build'

# Pre-commit checks
alias pcheck='pnpm lint:fix && pnpm format && pnpm type-check && pnpm test:unit:run'

# Full validation
alias pfull='pnpm validate && pnpm test:unit:run && pnpm build'

# Development workflow (3 terminals)
alias pdev1='pnpm dev'
alias pdev2='pnpm test:unit:watch'
alias pdev3='pnpm db:studio'

# Start all services
alias pall='pnpm docker:dev && pnpm redis:start && pnpm queue:worker &'

# ═══════════════════════════════════════════════════════════════════════════
# Installation Instructions
# ═══════════════════════════════════════════════════════════════════════════

# Bash/Ubuntu:
#   1. Copy this file to ~/.bash_aliases or ~/.bashrc
#   2. Run: source ~/.bashrc

# Zsh/macOS:
#   1. Copy this file to ~/.zshrc or create ~/.zsh_aliases
#   2. Run: source ~/.zshrc

# Windows (Git Bash):
#   1. Copy this file to ~/.bash_profile or ~/.bashrc
#   2. Run: source ~/.bash_profile

# PowerShell (Windows):
#   See scripts/aliases.ps1 for PowerShell version

# ═══════════════════════════════════════════════════════════════════════════
# Usage Examples
# ═══════════════════════════════════════════════════════════════════════════

# Start development:          pd
# Run tests:                  pti
# Fix code:                   plf && pf
# Check database:             phdb
# Reset database:             pdr
# Upload images:              pub
# Check everything:           pval
# Clean and rebuild:          prefresh

# ═══════════════════════════════════════════════════════════════════════════
# Tips
# ═══════════════════════════════════════════════════════════════════════════

# List all aliases:           alias | grep '^p'
# Edit aliases:               nano ~/.bashrc (or ~/.zshrc)
# Reload aliases:             source ~/.bashrc (or ~/.zshrc)
# Remove alias:               unalias <name>
# Temporary alias:            alias pd='pnpm dev'  (session only)

# ═══════════════════════════════════════════════════════════════════════════

echo "✅ ComicWise aliases loaded! Type 'alias | grep ^p' to see all."
