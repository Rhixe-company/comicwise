.PHONY: help install dev build start stop clean test lint format db-push db-studio db-seed docker-up docker-down docker-build

# ============================================
# ComicWise - Makefile (Next.js 16 Optimized)
# ============================================

# Colors for terminal output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message with descriptions
	@echo "$(BLUE)════════════════════════════════════════════$(NC)"
	@echo "$(BLUE)   ComicWise - Available Commands$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# Development Commands
# ============================================

install: ## Install all dependencies with pnpm
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@pnpm install

dev: ## Start development server with Turbopack
	@echo "$(BLUE)Starting development server with Turbopack...$(NC)"
	@pnpm dev

build: ## Build application for production
	@echo "$(BLUE)Building application for production...$(NC)"
	@pnpm build

start: ## Start production server
	@echo "$(BLUE)Starting production server...$(NC)"
	@pnpm start

preview: build start ## Build and start production preview

stop: ## Stop all running Node processes
	@echo "$(YELLOW)Stopping Node processes...$(NC)"
	@pkill -f "node" || echo "No processes to kill"

clean: ## Clean build artifacts, caches, and dependencies
	@echo "$(YELLOW)Cleaning build artifacts and caches...$(NC)"
	@rm -rf .next dist build coverage .turbo
	@rm -rf node_modules
	@rm -f tsconfig.tsbuildinfo pnpm-lock.yaml
	@echo "$(GREEN)✓ Clean complete$(NC)"

# ============================================
# Code Quality Commands
# ============================================

lint: ## Run ESLint
	@echo "$(BLUE)Running ESLint...$(NC)"
	@pnpm lint

lint-fix: ## Fix ESLint issues automatically
	@echo "$(BLUE)Fixing ESLint issues...$(NC)"
	@pnpm lint:fix

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code with Prettier...$(NC)"
	@pnpm format

format-check: ## Check code formatting without making changes
	@echo "$(BLUE)Checking code formatting...$(NC)"
	@pnpm format:check

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type checks...$(NC)"
	@pnpm type-check

cspell: ## Run spell checker
	@echo "$(BLUE)Running spell checker...$(NC)"
	@pnpm cspell

check-all: lint format-check type-check ## Run all code quality checks
	@echo "$(GREEN)✓ All quality checks passed!$(NC)"

# ============================================
# Database Commands
# ============================================

db-generate: ## Generate Drizzle migrations
	@echo "$(BLUE)Generating database migrations...$(NC)"
	@pnpm db:generate

db-push: ## Push database schema changes
	@echo "$(BLUE)Pushing database schema...$(NC)"
	@pnpm db:push

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@pnpm db:migrate

db-studio: ## Open Drizzle Studio for database management
	@echo "$(BLUE)Opening Drizzle Studio...$(NC)"
	@pnpm db:studio

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	@pnpm db:seed

db-seed-users: ## Seed only users
	@echo "$(BLUE)Seeding users...$(NC)"
	@pnpm db:seed:users

db-seed-comics: ## Seed only comics
	@echo "$(BLUE)Seeding comics...$(NC)"
	@pnpm db:seed:comics

db-seed-chapters: ## Seed only chapters
	@echo "$(BLUE)Seeding chapters...$(NC}"
	@pnpm db:seed:chapters

db-reset: db-push db-seed ## Reset database (push schema and seed)
	@echo "$(GREEN)✓ Database reset complete!$(NC)"

# ============================================
# Docker Commands (Production)
# ============================================

docker-up: ## Start production Docker containers
	@echo "$(BLUE)Starting Docker containers (production)...$(NC)"
	@docker compose up -d
	@echo "$(GREEN)✓ Containers started$(NC)"

docker-down: ## Stop and remove Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	@docker compose down
	@echo "$(GREEN)✓ Containers stopped$(NC)"

docker-build: ## Build Docker images without cache
	@echo "$(BLUE)Building Docker images...$(NC)"
	@docker compose build --no-cache --progress=plain
	@echo "$(GREEN)✓ Images built$(NC)"

docker-rebuild: docker-down docker-build docker-up ## Rebuild and restart containers
	@echo "$(GREEN)✓ Docker rebuild complete!$(NC)"

docker-logs: ## View Docker logs (all services)
	@docker compose logs -f

docker-logs-app: ## View application logs only
	@docker compose logs -f app

docker-ps: ## Show container status
	@docker compose ps

docker-clean: ## Remove containers, volumes, networks, and images
	@echo "$(RED)⚠ This will remove all Docker resources!$(NC)"
	@echo "$(YELLOW)Stopping containers...$(NC)"
	@docker compose down -v --remove-orphans
	@echo "$(YELLOW)Cleaning system...$(NC)"
	@docker system prune -af --volumes
	@echo "$(GREEN)✓ Docker cleanup complete!$(NC)"

# ============================================
# Docker Commands (Development)
# ============================================

docker-dev: ## Start development Docker containers (DB & Redis only)
	@echo "$(BLUE)Starting development containers...$(NC)"
	@docker compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)✓ Development containers started$(NC)"

docker-dev-down: ## Stop development containers
	@echo "$(YELLOW)Stopping development containers...$(NC)"
	@docker compose -f docker-compose.dev.yml down
	@echo "$(GREEN)✓ Development containers stopped$(NC)"

docker-dev-clean: ## Clean development containers and volumes
	@echo "$(YELLOW)Cleaning development containers...$(NC)"
	@docker compose -f docker-compose.dev.yml down -v
	@echo "$(GREEN)✓ Development cleanup complete!$(NC)"

# ============================================
# Testing Commands
# ============================================

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	@pnpm test

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(NC)"
	@pnpm test:watch

test-coverage: ## Run tests with coverage report
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	@pnpm test:coverage

test-docker: ## Test Docker setup end-to-end
	@echo "$(BLUE)Testing Docker setup...$(NC)"
	@bash test-docker.sh

# ============================================
# Utility Commands
# ============================================

check-updates: ## Check for package updates
	@echo "$(BLUE)Checking for updates...$(NC)"
	@pnpm outdated

update-deps: ## Update dependencies interactively
	@echo "$(BLUE)Updating dependencies...$(NC)"
	@pnpm update --interactive --latest

deps-audit: ## Check for security vulnerabilities
	@echo "$(BLUE)Auditing dependencies...$(NC)"
	@pnpm audit

deps-audit-fix: ## Fix security vulnerabilities automatically
	@echo "$(BLUE)Fixing vulnerabilities...$(NC)"
	@pnpm audit --fix

# ============================================
# Combined Workflows
# ============================================

setup: install db-push db-seed ## Complete setup: install deps, setup DB, and seed
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start.$(NC)"

dev-setup: docker-dev install db-push db-seed ## Setup development environment with Docker
	@echo "$(GREEN)✓ Development environment ready! Run 'make dev'.$(NC)"

prod-build: check-all build ## Run quality checks and build for production
	@echo "$(GREEN)✓ Production build complete!$(NC)"

prod-deploy: prod-build docker-build docker-up ## Full production deployment
	@echo "$(GREEN)✓ Production deployment complete!$(NC)"

reset: clean install ## Clean and reinstall everything
	@echo "$(GREEN)✓ Reset complete!$(NC)"

fresh-start: docker-clean clean install docker-dev db-push db-seed ## Complete fresh start
	@echo "$(GREEN)✓ Fresh start complete! Run 'make dev'.$(NC)"

# ============================================
# CI/CD Commands
# ============================================

ci: check-all test build ## Run CI pipeline locally
	@echo "$(GREEN)✓ CI pipeline passed!$(NC)"

pre-commit: format lint type-check ## Run pre-commit checks
	@echo "$(GREEN)✓ Pre-commit checks passed!$(NC)"

pre-push: check-all test ## Run pre-push checks
	@echo "$(GREEN)✓ Pre-push checks passed!$(NC)"
