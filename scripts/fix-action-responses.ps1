# ════════════════════════════════════════════════════════════════
# Fix ActionResponse Type Errors - Batch Script
# ════════════════════════════════════════════════════════════════

Write-Host "🔧 Fixing ActionResponse type errors..." -ForegroundColor Cyan

$actionFiles = @(
    "src\lib\actions\artists.ts",
    "src\lib\actions\auth.ts",
    "src\lib\actions\auth\actions.ts",
    "src\lib\actions\authors.ts",
    "src\lib\actions\comments.ts",
    "src\lib\actions\genres.ts",
    "src\lib\actions\types.ts",
    "src\lib\actions\users.ts",
    "src\lib\actions\workflow.ts"
)

foreach ($file in $actionFiles) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "  Processing: $file" -ForegroundColor Yellow
        
        # Read content
        $content = Get-Content $filePath -Raw
        
        # Check if utils import already exists
        if ($content -notmatch 'from\s+["''@]./utils["'']') {
            # Add import at the top after other imports
            $content = $content -replace '(import\s+type\s+\{[^}]+\}\s+from\s+["''@]/types["''];)', "`$1`nimport { error, success } from `"./utils`";"
        }
        
        # Replace error returns with error() function
        $content = $content -replace 'return\s+\{\s*error:\s*"([^"]+)"\s*\};', 'return error("$1");'
        $content = $content -replace 'return\s+\{\s*error:\s*([^}]+)\s*\};', 'return error($1);'
        
        # Replace success returns with success() function
        $content = $content -replace 'return\s+\{\s*success:\s*true,\s*data:\s*([^,}]+)\s*\};', 'return success($1);'
        $content = $content -replace 'return\s+\{\s*success:\s*true,\s*data:\s*([^,}]+),\s*message:\s*"([^"]+)"\s*\};', 'return success($1, "$2");'
        
        # Write back
        Set-Content $filePath $content -NoNewline
        
        Write-Host "  ✓ Fixed: $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Batch fix complete!" -ForegroundColor Green
Write-Host "Run 'pnpm type-check' to verify the fixes." -ForegroundColor Cyan
