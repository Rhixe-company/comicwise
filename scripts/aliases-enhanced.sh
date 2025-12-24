# ComicWise - Shell Aliases for Lightning-Fast Commands

# Development
alias dev="pnpm dev"
alias build="pnpm build"
alias start="pnpm start"
alias lint="pnpm lint"
alias lintfix="pnpm lint:fix"
alias format="pnpm format"
alias test="pnpm test"
alias tc="pnpm type-check"

# Database
alias dbpush="pnpm db:push"
alias dbseed="pnpm db:seed"
alias dbreset="pnpm db:reset"
alias dbstudio="pnpm db:studio"

# Docker
alias dup="pnpm docker:up"
alias ddown="pnpm docker:down"
alias dlogs="pnpm docker:logs"

# Scripts
alias optimize="pnpm tsx scripts/optimize-project.ps1"
alias scaffold="pnpm tsx scripts/scaffold-enhanced.ts"
alias imports="pnpm tsx scripts/replace-imports.ts"
alias cleanup="pnpm tsx scripts/cleanup-comprehensive.ts"

# Git shortcuts
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gpl="git pull"
alias gco="git checkout"
alias gb="git branch"

# Quick actions
alias cache:clear="pnpm cache:clear"
alias deps="pnpm install"
alias clean="pnpm clean"
alias validate="pnpm validate"
alias check="pnpm ci"
