#!/usr/bin/env bash
#
# ComicWise CLI - Bash wrapper
#
# Usage: ./cw.sh <command> [options]
# Example: ./cw.sh dev
# Example: ./cw.sh db seed --verbose

set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root
cd "$PROJECT_ROOT"

# Run CLI
pnpm tsx cli/index.ts "$@"
