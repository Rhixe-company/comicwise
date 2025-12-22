#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ComicWise CLI - PowerShell wrapper

.DESCRIPTION
    Wrapper script for the ComicWise CLI tool

.PARAMETER Command
    CLI command to execute

.EXAMPLE
    .\cw.ps1 dev
    .\cw.ps1 db seed --verbose
#>

param(
    [Parameter(ValueFromRemainingArguments)]
    [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Change to project root
Push-Location $ProjectRoot

try {
    # Run CLI
    pnpm tsx cli/index.ts @Arguments
}
finally {
    Pop-Location
}
