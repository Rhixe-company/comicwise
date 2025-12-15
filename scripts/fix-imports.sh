#!/usr/bin/env bash
set -euo pipefail

# Attempt to auto-fix imports and formatting
if command -v pnpm >/dev/null 2>&1; then
  if command -v eslint >/dev/null 2>&1; then
    pnpm exec eslint --fix . || true
  else
    pnpm dlx eslint --fix . || true
  fi
else
  if command -v eslint >/dev/null 2>&1; then
    eslint --fix . || true
  else
    npx eslint --fix . || true
  fi
fi

# Run prettier organize imports if configured
if command -v pnpm >/dev/null 2>&1; then
  pnpm format || true
else
  npm run format || true
fi

echo "Attempted to fix imports and format."
