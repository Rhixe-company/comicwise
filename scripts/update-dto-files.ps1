# Update all DTO files to use "use server" and export from actions

$dtoDir = "src\lib\dto"

# Update each DTO file
$dtoFiles = @{
    "artistsDto.ts" = "artists"
    "authDto.ts" = "auth"
    "authorsArtistsDto.ts" = "authorsArtists"
    "authorsDto.ts" = "authors"
    "bookmarkDto.ts" = "bookmark"
    "bookmarksCommentsDto.ts" = "bookmarksComments"
    "chapterDto.ts" = "chapter"
    "chaptersDto.ts" = "chapters"
    "comicDto.ts" = "comic"
    "comicsDto.ts" = "comics"
    "commentsDto.ts" = "comments"
    "genresDto.ts" = "genres"
    "genresTypesDto.ts" = "genresTypes"
    "typesDto.ts" = "types"
    "usersDto.ts" = "users"
    "usersManagementDto.ts" = "usersManagement"
    "workflowDto.ts" = "workflow"
}

foreach ($file in $dtoFiles.Keys) {
    $actionName = $dtoFiles[$file]
    $content = @"
"use server";

/**
 * Data Transfer Objects for $actionName actions
 * Centralized exports for $actionName server actions
 */

export * from "../actions/$actionName";
"@
    Set-Content -Path "$dtoDir\$file" -Value $content -Force
    Write-Host "✓ Updated: $file"
}

# Update index.ts
$indexContent = @'
"use server";

/**
 * Centralized DTO exports
 * Re-export all DTO modules for easy importing
 */

export * from "./artistsDto";
export * from "./authDto";
export * from "./authorsArtistsDto";
export * from "./authorsDto";
export * from "./bookmarkDto";
export * from "./bookmarksCommentsDto";
export * from "./chapterDto";
export * from "./chaptersDto";
export * from "./comicDto";
export * from "./comicsDto";
export * from "./commentsDto";
export * from "./genresDto";
export * from "./genresTypesDto";
export * from "./typesDto";
export * from "./usersDto";
export * from "./usersManagementDto";
export * from "./workflowDto";
'@

Set-Content -Path "$dtoDir\index.ts" -Value $indexContent -Force
Write-Host "✓ Updated: index.ts"

Write-Host "`n✅ All DTO files updated successfully!"
