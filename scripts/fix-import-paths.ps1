# Fix Import Paths - Direct Replacement Script
# Fixes all incorrect import paths in src directory

Write-Host "=== Starting Import Path Fixes ===" -ForegroundColor Cyan

$filesChanged = 0
$totalChanges = 0

# Get all TypeScript files
$files = Get-ChildItem -Path "src" -Include *.ts,*.tsx -Recurse -File

Write-Host "Found $($files.Count) files to process`n" -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Fix UI imports
    $content = $content -creplace 'from\s+([''"])ui/', 'from $1@/components/ui/'
    
    # Fix component imports (but not @/components)
    $content = $content -creplace 'from\s+([''"])components/', 'from $1@/components/'
    
    # Fix database imports
    $content = $content -creplace 'from\s+([''"])database/', 'from $1@/database/'
    
    # Fix lib/validations
    $content = $content -creplace 'from\s+([''"])lib/validations', 'from $1@/lib/validations'
    
    # Fix /dto/ (leading slash)
    $content = $content -creplace 'from\s+([''""])/dto/', 'from $1@/dto/'
    
    # Fix /types/ (leading slash)
    $content = $content -creplace 'from\s+([''""])/types/', 'from $1@/types/'
    
    # Fix /services/ (leading slash)
    $content = $content -creplace 'from\s+([''""])/services/', 'from $1@/services/'
    
    # Fix combined /typesdatabase
    $content = $content -creplace 'from\s+([''""])/typesdatabase', 'from $1@/types/database'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $filesChanged++
        $changes = ([regex]::Matches($original, 'from')).Count
        $totalChanges += $changes
        
        $relativePath = $file.FullName -replace [regex]::Escape((Get-Location).Path + '\'), ''
        Write-Host "✅ $relativePath" -ForegroundColor Green
    }
}

Write-Host "`n✨ Import fixing complete!" -ForegroundColor Green
Write-Host "📊 Updated $filesChanged files" -ForegroundColor Cyan
