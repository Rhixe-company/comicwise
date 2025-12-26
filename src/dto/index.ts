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
} from "src/src/dto/authDto";

// Artist DTOs
export type {
  ArtistDto,
  ArtistListDto,
  ArtistWithComicsDto,
  CreateArtistDto,
  UpdateArtistDto,
} from "src/src/dto/artistsDto";

// Author DTOs
export type {
  AuthorDto,
  AuthorListDto,
  AuthorWithComicsDto,
  CreateAuthorDto,
  UpdateAuthorDto,
} from "src/src/dto/authorsDto";

// Chapter DTOs
export type {
  ChapterDto,
  ChapterListDto,
  ChapterNavigationDto,
  ChapterWithImagesDto,
  CreateChapterDto,
  UpdateChapterDto,
} from "src/src/dto/chaptersDto";

// Comic DTOs
export type {
  ComicDto,
  ComicFiltersDto,
  ComicListDto,
  ComicWithRelationsDto,
  CreateComicDto,
  UpdateComicDto,
} from "src/src/dto/comicsDto";

// Genre DTOs
export type {
  CreateGenreDto,
  GenreDto,
  GenreListDto,
  GenreWithComicsDto,
  UpdateGenreDto,
} from "src/src/dto/genresDto";

// Type DTOs
export type {
  CreateTypeDto,
  TypeDto,
  TypeListDto,
  TypeWithComicsDto,
  UpdateTypeDto,
} from "src/src/dto/typesDto";

// User DTOs
export type { SafeUserDto, UserListDto, UserWithBookmarksDto } from "src/src/dto/usersDto";

// Combined DTOs
export type { GenresTypesDto, GenresTypesWithCountsDto } from "src/src/dto/genresTypesDto";

// Bookmark DTOs
export type {
  BookmarkDto,
  BookmarkListDto,
  BookmarkWithComicDto,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from "src/src/dto/bookmarkDto";

// Comment DTOs
export type {
  CommentDto,
  CommentListDto,
  CommentWithUserDto,
  CreateCommentDto,
  UpdateCommentDto,
} from "src/src/dto/commentDto";
