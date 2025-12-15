<#
.SYNOPSIS
  Create a timestamped backup ZIP of important project files.
#>
param(
  [string]$OutDir = "backups"
)

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$ts = Get-Date -Format "yyyyMMddTHHmmss"
$archive = Join-Path $OutDir "comicwise-backup-$ts.zip"

$items = @('package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'public', 'src', 'scripts')
$existing = $items | Where-Object { Test-Path $_ }

if ($existing.Count -eq 0) { Write-Warning "No files found to back up."; exit 1 }

Write-Output "Creating backup: $archive"
Compress-Archive -Path $existing -DestinationPath $archive -Force
Write-Output "Backup complete: $archive"
