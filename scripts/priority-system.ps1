#!/usr/bin/env pwsh
# ComicWise Priority System - PowerShell Implementation for Windows
# Lightweight priority system management for Windows environments

param(
  [Parameter(Position = 0)]
  [ValidateSet("list", "status", "view-p0", "view-p1", "view-p2", "view-p3", "help")]
  [string]$Command = "help",

  [Parameter(Position = 1)]
  [string]$TaskId = ""
)

# Color definitions
$script:ColorRed = "`e[31m"
$script:ColorGreen = "`e[32m"
$script:ColorYellow = "`e[33m"
$script:ColorBlue = "`e[34m"
$script:ColorCyan = "`e[36m"
$script:ColorReset = "`e[0m"

function Write-ColoredOutput {
  param([string]$Message, [string]$Color = $ColorReset)
  Write-Host "$Color$Message$ColorReset"
}

function Show-Help {
  @"

╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║        ComicWise Priority System - PowerShell Implementation          ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝

USAGE: .\scripts\priority-system.ps1 [COMMAND]

COMMANDS:
  list              List all 15 tasks by priority level
  status            Show current progress (0/15 ready to start)
  view-p0           View P0 (Immediate) tasks
  view-p1           View P1 (High Priority) tasks
  view-p2           View P2 (Medium Priority) tasks
  view-p3           View P3 (Low Priority) tasks
  help              Show this help message

QUICK START:
  .\scripts\priority-system.ps1 list
  .\scripts\priority-system.ps1 status
  .\scripts\priority-system.ps1 view-p0

EXAMPLES:
  PowerShell:
    > .\scripts\priority-system.ps1 list
    > .\scripts\priority-system.ps1 status

  npm scripts (recommended):
    $ pnpm priority:list
    $ pnpm priority:status

NOTE:
  For detailed task tracking, update PRIORITY_SYSTEM_CHECKLIST.md
  For implementation steps, read PRIORITY_SYSTEM.md

"@
}

function Show-PriorityList {
  Write-Host "`n"
  Write-ColoredOutput "═══════════════════════════════════════════════════" $ColorCyan
  Write-ColoredOutput "ComicWise Priority System - Task List" $ColorCyan
  Write-ColoredOutput "═══════════════════════════════════════════════════`n" $ColorCyan

  Write-ColoredOutput "🔴 P0: IMMEDIATE (3 hours)" $ColorRed
  Write-Host "   Blocking dev/build/test - Must complete first"
  Write-Host "   Progress: 0/3 (0%)`n"
  Write-Host "   ⭕ p0-1: Repo Health & TypeScript Validation (0.5h)"
  Write-Host "      Ensure clean builds and type safety"
  Write-Host ""
  Write-Host "   ⭕ p0-2: Database Setup & Schema (0.5h) [depends: p0-1]"
  Write-Host "      Ensure database schema with Drizzle ORM is properly configured"
  Write-Host ""
  Write-Host "   ⭕ p0-3: Environment Variables & App Config (1h) [depends: p0-1]"
  Write-Host "      Centralize and validate all environment variables"
  Write-Host ""

  Write-ColoredOutput "🟠 P1: HIGH PRIORITY (9 hours)" $ColorYellow
  Write-Host "   Must complete before merge"
  Write-Host "   Progress: 0/3 (0%)`n"
  Write-Host "   ⭕ p1-1: Auth Wiring (NextAuth v5 + Drizzle) (3h) [depends: p0-1, p0-2, p0-3]"
  Write-Host "      Complete authentication setup with NextAuth and Drizzle adapter"
  Write-Host ""
  Write-Host "   ⭕ p1-2: Image Upload Integration (3h) [depends: p0-3]"
  Write-Host "      Unified image upload with Cloudinary/ImageKit/Local support"
  Write-Host ""
  Write-Host "   ⭕ p1-3: Database Seeding with Realistic Data (2h) [depends: p0-2]"
  Write-Host "      Populate test database with sample data"
  Write-Host ""

  Write-ColoredOutput "🟡 P2: MEDIUM PRIORITY (15 hours)" $ColorBlue
  Write-Host "   Important enhancements - after P0 & P1"
  Write-Host "   Progress: 0/4 (0%)`n"
  Write-Host "   ⭕ p2-1: Advanced Email Notifications (3h) [depends: p1-1]"
  Write-Host "      Workflow-based email notifications for user actions"
  Write-Host ""
  Write-Host "   ⭕ p2-2: Complete Admin Dashboard (8h) [depends: p1-1, p1-2]"
  Write-Host "      Finish admin CRUD pages and analytics"
  Write-Host ""
  Write-Host "   ⭕ p2-3: Full-Text Search Implementation (2h) [depends: p0-2]"
  Write-Host "      Enable powerful search across comics and chapters"
  Write-Host ""
  Write-Host "   ⭕ p2-4: Performance Optimization (2h) [depends: p0-2]"
  Write-Host "      Implement caching and query optimization"
  Write-Host ""

  Write-ColoredOutput "🟢 P3: LOW PRIORITY (20 hours)" $ColorGreen
  Write-Host "   Nice-to-have or future improvements"
  Write-Host "   Progress: 0/4 (0%)`n"
  Write-Host "   ⭕ p3-1: Testing Suite (8h) [depends: p0-1]"
  Write-Host "      Achieve 80%+ code coverage with unit and E2E tests"
  Write-Host ""
  Write-Host "   ⭕ p3-2: CI/CD Pipeline (4h) [depends: p3-1]"
  Write-Host "      Automate testing and deployment"
  Write-Host ""
  Write-Host "   ⭕ p3-3: Docker & Deployment (4h) [depends: p0-2]"
  Write-Host "      Production-ready containerization"
  Write-Host ""
  Write-Host "   ⭕ p3-4: Documentation (4h) [depends: p0-1]"
  Write-Host "      Complete project documentation"
  Write-Host ""

  Write-ColoredOutput "📊 OVERALL PROGRESS: 0/15 tasks (0%)" $ColorCyan
  Write-ColoredOutput "═══════════════════════════════════════════════════`n" $ColorCyan
}

function Show-Status {
  Write-Host "`n"
  Write-ColoredOutput "Priority System Status" $ColorBlue
  Write-ColoredOutput "═══════════════════════════════════════════════════`n" $ColorCyan

  Write-ColoredOutput "🔴 P0: 0/3 (0%) complete" $ColorRed
  Write-ColoredOutput "🟠 P1: 0/3 (0%) complete" $ColorYellow
  Write-ColoredOutput "🟡 P2: 0/4 (0%) complete" $ColorBlue
  Write-ColoredOutput "🟢 P3: 0/4 (0%) complete" $ColorGreen

  Write-Host ""
  Write-ColoredOutput "📊 TOTAL: 0/15 (0%) complete" $ColorYellow
  Write-ColoredOutput "═══════════════════════════════════════════════════`n" $ColorCyan
}

function Show-PriorityP0 {
  Write-Host ""
  Write-ColoredOutput "🔴 P0: IMMEDIATE - Foundation (3 hours)" $ColorRed
  Write-ColoredOutput "════════════════════════════════════════════════════`n" $ColorCyan

  Write-Host "Current Status: 0/3 tasks complete (0%)"
  Write-Host ""
  Write-Host "Tasks:"
  Write-Host "  ⭕ P0-1: Repo Health & TypeScript Validation (30 min)"
  Write-Host "  ⭕ P0-2: Database Setup & Schema (30 min)"
  Write-Host "  ⭕ P0-3: Environment Variables & App Config (1 hour)"
  Write-Host ""
  Write-Host "For detailed instructions:"
  Write-Host "  → cat PRIORITY_SYSTEM_CHECKLIST.md | Select-String 'P0-1' -A 30"
  Write-Host ""
}

function Show-PriorityP1 {
  Write-Host ""
  Write-ColoredOutput "🟠 P1: HIGH PRIORITY - Core Features (9 hours)" $ColorYellow
  Write-ColoredOutput "════════════════════════════════════════════════════`n" $ColorCyan

  Write-Host "Current Status: 0/3 tasks complete (0%)"
  Write-Host "Requires: All P0 tasks complete"
  Write-Host ""
  Write-Host "Tasks:"
  Write-Host "  ⭕ P1-1: Auth Wiring (NextAuth v5 + Drizzle) (3 hours)"
  Write-Host "  ⭕ P1-2: Image Upload Integration (3 hours)"
  Write-Host "  ⭕ P1-3: Database Seeding (2 hours)"
  Write-Host ""
  Write-Host "For detailed instructions:"
  Write-Host "  → cat PRIORITY_SYSTEM_CHECKLIST.md | Select-String 'P1-1' -A 30"
  Write-Host ""
}

function Show-PriorityP2 {
  Write-Host ""
  Write-ColoredOutput "🟡 P2: MEDIUM PRIORITY - Enhancements (15 hours)" $ColorBlue
  Write-ColoredOutput "════════════════════════════════════════════════════`n" $ColorCyan

  Write-Host "Current Status: 0/4 tasks complete (0%)"
  Write-Host "Requires: All P1 tasks complete"
  Write-Host ""
  Write-Host "Tasks:"
  Write-Host "  ⭕ P2-1: Email Notifications (3 hours)"
  Write-Host "  ⭕ P2-2: Admin Dashboard (8 hours)"
  Write-Host "  ⭕ P2-3: Full-Text Search (2 hours)"
  Write-Host "  ⭕ P2-4: Performance Optimization (2 hours)"
  Write-Host ""
  Write-Host "For detailed instructions:"
  Write-Host "  → cat PRIORITY_SYSTEM_CHECKLIST.md | Select-String 'P2-1' -A 30"
  Write-Host ""
}

function Show-PriorityP3 {
  Write-Host ""
  Write-ColoredOutput "🟢 P3: LOW PRIORITY - Polish (20 hours)" $ColorGreen
  Write-ColoredOutput "════════════════════════════════════════════════════`n" $ColorCyan

  Write-Host "Current Status: 0/4 tasks complete (0%)"
  Write-Host "Requires: All P2 tasks complete"
  Write-Host ""
  Write-Host "Tasks:"
  Write-Host "  ⭕ P3-1: Testing Suite (8 hours)"
  Write-Host "  ⭕ P3-2: CI/CD Pipeline (4 hours)"
  Write-Host "  ⭕ P3-3: Docker & Deployment (4 hours)"
  Write-Host "  ⭕ P3-4: Documentation (4 hours)"
  Write-Host ""
  Write-Host "For detailed instructions:"
  Write-Host "  → cat PRIORITY_SYSTEM_CHECKLIST.md | Select-String 'P3-1' -A 30"
  Write-Host ""
}

# Main execution
switch ($Command) {
  "list" {
    Show-PriorityList
  }
  "status" {
    Show-Status
  }
  "view-p0" {
    Show-PriorityP0
  }
  "view-p1" {
    Show-PriorityP1
  }
  "view-p2" {
    Show-PriorityP2
  }
  "view-p3" {
    Show-PriorityP3
  }
  "help" {
    Show-Help
  }
  default {
    Write-ColoredOutput "❌ Unknown command: $Command" $ColorRed
    Write-Host "Use: .\scripts\priority-system.ps1 help"
    exit 1
  }
}

exit 0
