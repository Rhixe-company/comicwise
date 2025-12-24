# ComicWise Project Aliases
# PowerShell aliases for lightning-fast commands

# Development
Set-Alias cw-dev 'pnpm dev'
Set-Alias cw-build 'pnpm build'
Set-Alias cw-start 'pnpm start'

# Database
Set-Alias cw-db-push 'pnpm db:push'
Set-Alias cw-db-seed 'pnpm db:seed'
Set-Alias cw-db-studio 'pnpm db:studio'
Set-Alias cw-db-reset 'pnpm db:reset'

# Testing
Set-Alias cw-test 'pnpm test'
Set-Alias cw-test-unit 'pnpm test:unit'

# Linting & Formatting
Set-Alias cw-lint 'pnpm lint'
Set-Alias cw-lint-fix 'pnpm lint:fix'
Set-Alias cw-format 'pnpm format'

# Type Checking
Set-Alias cw-type-check 'pnpm type-check'

# Validation
Set-Alias cw-validate 'pnpm validate'

# Scaffolding
Set-Alias cw-scaffold 'pnpm scaffold'

# Optimization
Set-Alias cw-optimize 'pnpm tsx scripts/MasterOptimization.ts'

Write-Host "ComicWise aliases loaded! Use 'cw-' prefix for commands." -ForegroundColor Green
