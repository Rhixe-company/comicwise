#!/usr/bin/env bash
set -euo pipefail

# Restore the latest backup from backups/ or a specific file
TARGET=${1-}
if [[ -z "$TARGET" ]]; then
  TARGET=$(ls -1 backups/*comicwise-backup-*.tar.gz 2>/dev/null | sort | tail -n1 || true)
  if [[ -z "$TARGET" ]]; then echo "No backup found in backups/"; exit 1; fi
fi

echo "Restoring from: $TARGET"
if [[ "$TARGET" == *.zip ]]; then
  unzip -o "$TARGET"
else
  tar -xzf "$TARGET"
fi

echo "Restore complete."
