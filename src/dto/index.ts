/**
 * DTO Module Exports
 * Central export point for all Data Transfer Objects
 */

// Auth DTOs
export type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  SignInDto,
  SignUpDto,
  VerifyEmailDto,
  ResetPasswordDto,
  RequestPasswordResetDto,
  AuthResponseDto,
  SessionDto,
} from "./authDto";

// Artist DTOs
export type { ArtistDto, CreateArtistDto, UpdateArtistDto, ArtistListDto, ArtistWithComicsDto } from "./artistsDto";

// Author DTOs
export type { AuthorDto, CreateAuthorDto, UpdateAuthorDto, AuthorListDto, AuthorWithComicsDto } from "./authorsDto";

// Chapter DTOs
export type {
  ChapterDto,
  CreateChapterDto,
  UpdateChapterDto,
  ChapterListDto,
  ChapterWithImagesDto,
  ChapterNavigationDto,
} from "./chaptersDto";

// Comic DTOs
export type {
  ComicDto,
  CreateComicDto,
  UpdateComicDto,
  ComicListDto,
  ComicWithRelationsDto,
  ComicFiltersDto,
} from "./comicsDto";

// Genre DTOs
export type { GenreDto, CreateGenreDto, UpdateGenreDto, GenreListDto, GenreWithComicsDto } from "./genresDto";

// Type DTOs
export type { TypeDto, CreateTypeDto, UpdateTypeDto, TypeListDto, TypeWithComicsDto } from "./typesDto";

// User DTOs
export type { UserListDto, UserWithBookmarksDto, SafeUserDto } from "./usersDto";

// Combined DTOs
export type { GenresTypesDto, GenresTypesWithCountsDto } from "./genresTypesDto";

// Bookmark DTOs
export type { BookmarkDto, CreateBookmarkDto, UpdateBookmarkDto, BookmarkListDto, BookmarkWithComicDto } from "./bookmarkDto";

// Comment DTOs
export type { CommentDto, CreateCommentDto, UpdateCommentDto, CommentListDto, CommentWithUserDto } from "./commentDto";

