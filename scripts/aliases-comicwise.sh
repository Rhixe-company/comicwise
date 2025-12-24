#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# ComicWise Shell Aliases - Bash/Zsh
# ═══════════════════════════════════════════════════════════════════════════
# Installation:
#   1. Add this to your ~/.bashrc or ~/.zshrc:
#      source /path/to/comicwise/scripts/aliases-comicwise.sh
#   2. Or run: echo "source $(pwd)/scripts/aliases-comicwise.sh" >> ~/.bashrc
# ═══════════════════════════════════════════════════════════════════════════

echo -e "\033[0;36mLoading ComicWise aliases...\033[0m"

# ═══════════════════════════════════════════════════
# CORE COMMANDS
# ═══════════════════════════════════════════════════

alias cw='pnpm'
alias cwd='pnpm dev'
alias cwb='pnpm build'
alias cws='pnpm start'
alias cwt='pnpm test'

# ═══════════════════════════════════════════════════
# DEVELOPMENT
# ═══════════════════════════════════════════════════

alias cw:dev='pnpm dev --turbopack'
alias cw:dev:debug='pnpm dev:debug'
alias cw:build='pnpm build'
alias cw:build:analyze='pnpm build:analyze'
alias cw:clean='pnpm clean'
alias cw:clean:all='pnpm clean:all'

# ═══════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════

alias cw:db='pnpm db:studio'
alias cw:db:push='pnpm db:push'
alias cw:db:seed='pnpm db:seed'
alias cw:db:reset='pnpm db:reset'
alias cw:db:generate='pnpm db:generate'

# ═══════════════════════════════════════════════════
# TYPE CHECKING & LINTING
# ═══════════════════════════════════════════════════

alias cw:check='pnpm type-check'
alias cw:lint='pnpm lint'
alias cw:lint:fix='pnpm lint:fix'
alias cw:format='pnpm format'
alias cw:validate='pnpm validate'

# ═══════════════════════════════════════════════════
# TESTING
# ═══════════════════════════════════════════════════

alias cw:test='pnpm test'
alias cw:test:unit='pnpm test:unit'
alias cw:test:ui='pnpm test:ui'
alias cw:test:e2e='pnpm test'

# ═══════════════════════════════════════════════════
# DOCKER
# ═══════════════════════════════════════════════════

alias cw:docker:up='pnpm docker:up'
alias cw:docker:down='pnpm docker:down'
alias cw:docker:logs='pnpm docker:logs'
alias cw:docker:build='pnpm docker:build'
alias cw:docker:clean='pnpm docker:clean'

# ═══════════════════════════════════════════════════
# CACHE & REDIS
# ═══════════════════════════════════════════════════

alias cw:cache:clear='pnpm cache:clear'
alias cw:cache:stats='pnpm cache:stats'
alias cw:redis:cli='pnpm redis:cli'
alias cw:redis:flush='pnpm redis:flush'

# ═══════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════

alias cw:scaffold='pnpm scaffold'
alias cw:imports:optimize='pnpm imports:optimize'
alias cw:health='pnpm health:all'
alias cw:setup='pnpm setup'

# ═══════════════════════════════════════════════════
# QUICK WORKFLOWS
# ═══════════════════════════════════════════════════

cw:fresh() {
  echo -e "\033[0;33m🔄 Fresh setup...\033[0m"
  pnpm clean
  pnpm install
  pnpm db:reset
  pnpm build
  echo -e "\033[0;32m✅ Fresh setup complete!\033[0m"
}

cw:quick:check() {
  echo -e "\033[0;33m🔍 Running quick checks...\033[0m"
  pnpm type-check
  pnpm lint
  echo -e "\033[0;32m✅ Checks complete!\033[0m"
}

cw:full:check() {
  echo -e "\033[0;33m🔍 Running full validation...\033[0m"
  pnpm validate
  pnpm test:unit:run
  echo -e "\033[0;32m✅ Full validation complete!\033[0m"
}

# ═══════════════════════════════════════════════════
# HELP
# ═══════════════════════════════════════════════════

cw:help() {
  echo ""
  echo -e "\033[0;36m═════════════════════════════════════════════════\033[0m"
  echo -e "\033[0;36m  ComicWise CLI Aliases\033[0m"
  echo -e "\033[0;36m═════════════════════════════════════════════════\033[0m"
  echo ""
  echo -e "\033[0;33mCORE:\033[0m"
  echo "  cw         - Run pnpm commands"
  echo "  cwd        - Start dev server"
  echo "  cwb        - Build project"
  echo "  cws        - Start production server"
  echo "  cwt        - Run tests"
  echo ""
  echo -e "\033[0;33mDATABASE:\033[0m"
  echo "  cw:db           - Open Drizzle Studio"
  echo "  cw:db:push      - Push schema to DB"
  echo "  cw:db:seed      - Seed database"
  echo "  cw:db:reset     - Reset database"
  echo ""
  echo -e "\033[0;33mQUALITY:\033[0m"
  echo "  cw:check        - Type check"
  echo "  cw:lint         - Run linter"
  echo "  cw:lint:fix     - Fix lint issues"
  echo "  cw:format       - Format code"
  echo "  cw:validate     - Full validation"
  echo ""
  echo -e "\033[0;33mWORKFLOWS:\033[0m"
  echo "  cw:fresh        - Fresh install & setup"
  echo "  cw:quick:check  - Quick type & lint check"
  echo "  cw:full:check   - Full validation & tests"
  echo ""
  echo -e "\033[0;36m═════════════════════════════════════════════════\033[0m"
  echo ""
}

echo -e "\033[0;32m✅ ComicWise aliases loaded! Type 'cw:help' for commands.\033[0m"
