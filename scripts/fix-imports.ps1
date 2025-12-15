<#
.SYNOPSIS
  Attempt to auto-fix imports with ESLint and run Prettier.
#>
param()

function Run-EslintFix {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    try { pnpm exec eslint --fix .; return } catch { }
    try { pnpm dlx eslint --fix .; return } catch { }
  }
  if (Get-Command eslint -ErrorAction SilentlyContinue) { eslint --fix .; return }
  if (Get-Command npx -ErrorAction SilentlyContinue) { npx eslint --fix . }
}

Run-EslintFix

if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm format } else { npm run format }
Write-Output "Attempted to fix imports and format."
