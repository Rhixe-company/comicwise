#!/usr/bin/env bash
set -euo pipefail

# Create a timestamped backup of project sources and public assets
TS=$(date +%Y%m%dT%H%M%S)
OUTDIR="backups"
mkdir -p "$OUTDIR"
ARCHIVE="$OUTDIR/comicwise-backup-$TS.tar.gz"

echo "Creating backup: $ARCHIVE"
tar -czf "$ARCHIVE" package.json pnpm-lock.yaml pnpm-workspace.yaml public src scripts .env* || {
  echo "Warning: some files may be missing or unreadable; continuing.";
}

echo "Backup complete: $ARCHIVE"
