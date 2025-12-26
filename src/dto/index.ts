/**
 * DTO Module Exports
 * Central export point for all Data Transfer Objects
 */

// Auth DTOs
export type {
  AuthResponseDto,
  CreateUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  SessionDto,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
  UserDto,
  VerifyEmailDto,
} from "./authDto";

// Artist DTOs
export type {
  ArtistDto,
  ArtistListDto,
  ArtistWithComicsDto,
  CreateArtistDto,
  UpdateArtistDto,
} from "./artistsDto";

// Author DTOs
export type {
  AuthorDto,
  AuthorListDto,
  AuthorWithComicsDto,
  CreateAuthorDto,
  UpdateAuthorDto,
} from "./authorsDto";

// Chapter DTOs
export type {
  ChapterDto,
  ChapterListDto,
  ChapterNavigationDto,
  ChapterWithImagesDto,
  CreateChapterDto,
  UpdateChapterDto,
} from "./chaptersDto";

// Comic DTOs
export type {
  ComicDto,
  ComicFiltersDto,
  ComicListDto,
  ComicWithRelationsDto,
  CreateComicDto,
  UpdateComicDto,
} from "./comicsDto";

// Genre DTOs
export type {
  CreateGenreDto,
  GenreDto,
  GenreListDto,
  GenreWithComicsDto,
  UpdateGenreDto,
} from "./genresDto";

// Type DTOs
export type {
  CreateTypeDto,
  TypeDto,
  TypeListDto,
  TypeWithComicsDto,
  UpdateTypeDto,
} from "./typesDto";

// User DTOs
export type { SafeUserDto, UserListDto, UserWithBookmarksDto } from "./usersDto";

// Combined DTOs
export type { GenresTypesDto, GenresTypesWithCountsDto } from "./genresTypesDto";

// Bookmark DTOs
export type {
  BookmarkDto,
  BookmarkListDto,
  BookmarkWithComicDto,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from "./bookmarkDto";

// Comment DTOs
export type {
  CommentDto,
  CommentListDto,
  CommentWithUserDto,
  CreateCommentDto,
  UpdateCommentDto,
} from "./commentDto";
