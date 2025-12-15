<#
.SYNOPSIS
  Restore a project backup (zip) from backups/ or a given file.
#>
param(
  [string]$BackupFile
)

if (-not $BackupFile) {
  $files = Get-ChildItem -Path backups -Filter "*comicwise-backup*" | Sort-Object LastWriteTime
  if ($files.Count -eq 0) { Write-Error "No backups found in 'backups/'"; exit 1 }
  $BackupFile = $files[-1].FullName
}

Write-Output "Restoring $BackupFile"
if ($BackupFile -like "*.zip") {
  Expand-Archive -Path $BackupFile -DestinationPath . -Force
}
else {
  Write-Error "Unsupported archive format: $BackupFile"
  exit 1
}

Write-Output "Restore complete."
