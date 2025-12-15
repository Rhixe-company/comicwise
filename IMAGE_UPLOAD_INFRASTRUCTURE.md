# Image Upload Infrastructure

This document describes the centralized image upload infrastructure for
ComicWise.

## Overview

The image upload system provides a unified interface for uploading files to
different storage backends (local, ImageKit, or Cloudinary). It handles
validation, transformation, and metadata management with a clean API.

## Architecture

### Components

#### 1. **React Hook: `useImageUpload`** (`src/hooks/useImageUpload.ts`)

Client-side hook for managing file uploads with validation and progress
tracking.

**Features:**

- File type validation (configurable MIME types)
- File size validation (default 10MB for images)
- Upload progress tracking (0-100%)
- Error handling and reporting
- Success callbacks

**Usage:**

```tsx
const { fileInputRef, isUploading, uploadProgress, error, handleFileSelect } =
  useImageUpload({
    maxSizeMB: 10,
    uploadType: "comic-cover",
    onChange: (url) => console.log("URL:", url),
    onUploadComplete: (url) => saveToDatabase(url),
  });
```

#### 2. **Upload Service** (`src/services/upload/`)

Backend service for interacting with storage providers.

**Files:**

- `index.ts` - Main service with helper functions
- `types.ts` - TypeScript type definitions
- `factory.ts` - Provider selection and instantiation
- `providers/` - Provider implementations

**Main Functions:**

```tsx
// Upload a file
const result = await uploadImage(file, { folder: "comics", tags: ["cover"] });

// Delete a file
await deleteImage(publicId);

// Get URL with transformations
const url = await getImageUrl(publicId, { width: 800, quality: 80 });
```

#### 3. **Storage Providers** (`src/services/upload/providers/`)

Each provider implements the `UploadProvider` interface:

**LocalProvider** (`local.ts`)

- Stores files in `public/uploads/`
- Uses Sharp for image transformations
- Best for development
- No credentials needed

**ImageKitProvider** (`imagekit.ts`)

- Cloud-hosted image service
- Free tier: 20GB bandwidth/month, 25GB storage
- Supports real-time image transformation
- High performance with CDN

**CloudinaryProvider** (`cloudinary.ts`)

- Cloud-hosted media service
- Free tier: 25GB storage, generous bandwidth
- Comprehensive transformation API
- Advanced image optimization

#### 4. **Image Utilities** (`src/lib/image.ts`)

Helper functions for URL generation and transformations.

**Functions:**

```tsx
// Generate responsive srcset
getResponsiveSrcSet(url, [320, 640, 1024, 1920]);

// Get full CDN URL
getImageUrl("/uploads/comics/cover.jpg");

// Transform image with dimensions and quality
transformImage(url, 800, 600, 85);

// Get thumbnail
getThumbnailUrl(url, 300, 300);

// Delete image
deleteImage(url);

// Validate URL
isValidImageUrl(url);

// Extract public ID from URL
getPublicIdFromUrl(url);

// Calculate aspect ratio
getAspectRatio(1920, 1080); // 1.778

// Get optimized dimensions
getOptimizedDimensions(1920, 1080, 800); // { width: 800, height: 450 }
```

#### 5. **UI Component: `ClientImageUploader`** (`src/components/admin/ClientImageUploader.tsx`)

React component for file upload with preview and drag-and-drop.

**Features:**

- Drag and drop file selection
- Image preview before upload
- Upload progress indicator
- Error display
- Remove button for clearing uploads
- Responsive design

**Usage:**

```tsx
<ClientImageUploader
  value={imageUrl}
  onChange={setImageUrl}
  onUploadComplete={saveToDb}
  type="comic-cover"
  label="Upload Comic Cover"
  maxSize={10}
  disabled={isLoading}
/>
```

#### 6. **API Endpoint** (`src/app/api/upload/route.ts`)

Next.js API route handling file uploads with validation.

**POST /api/upload** Upload a single file with metadata.

**Request:**

```
FormData:
- file: File
- type: 'comic-cover' | 'chapter-image' | 'avatar' | 'general'
- entityId?: string (required for comic-cover and chapter-image)
- sequence?: number (for chapter images)
```

**Response:**

```json
{
  "fileId": "public-id",
  "name": "filename.jpg",
  "size": 102400,
  "success": true,
  "thumbnailUrl": "https://...",
  "url": "https://..."
}
```

**PUT /api/upload** Batch upload multiple files.

**Request:**

```
FormData:
- files: File[] (multiple)
- type: string
```

**Response:**

```json
{
  "errors": [],
  "failed": 0,
  "results": [
    {
      "index": 0,
      "originalName": "cover.jpg",
      "url": "https://...",
      "filename": "abc123.jpg",
      "size": 102400
    }
  ],
  "success": true,
  "uploaded": 5
}
```

## Configuration

### Environment Variables

Set in `.env.local`:

```env
# Choose upload provider
UPLOAD_PROVIDER=local  # 'local' | 'imagekit' | 'cloudinary'

# ImageKit Configuration (optional)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Upload Constraints

Default constraints by upload type:

```typescript
{
  'comic-cover': { maxSizeMB: 10, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  'chapter-image': { maxSizeMB: 10, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  'avatar': { maxSizeMB: 5, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  'general': { maxSizeMB: 10, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] }
}
```

## Usage Examples

### Basic File Upload in Form

```tsx
import { useImageUpload } from "@/hooks/useImageUpload";

export function EditComicForm() {
  const [coverUrl, setCoverUrl] = useState("");
  const { fileInputRef, isUploading, error, handleFileSelect } = useImageUpload(
    {
      maxSizeMB: 10,
      uploadType: "comic-cover",
      onChange: (url) => setCoverUrl(url),
    }
  );

  return (
    <form>
      <ClientImageUploader
        value={coverUrl}
        onChange={setCoverUrl}
        type="comic-cover"
      />
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelect}
      />
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Image Display with Optimization

```tsx
import { getResponsiveSrcSet, getImageUrl } from "@/lib/image";
import Image from "next/image";

export function ComicCover({ url }: { url: string }) {
  return (
    <Image
      src={getImageUrl(url)}
      alt="Comic cover"
      width={300}
      height={450}
      sizes="(max-width: 640px) 100vw, 50vw"
      quality={85}
    />
  );
}
```

### Server-Side Upload

```tsx
import { uploadImage } from "@/services/upload";

async function handleUpload(file: File) {
  const result = await uploadImage(file, {
    folder: "comics",
    filename: `cover-${Date.now()}`,
    tags: ["comic", "cover"],
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.url;
}
```

### Dynamic Provider Switching

```tsx
import {
  getUploadProvider,
  getAvailableProviders,
} from "@/services/upload/factory";

const providers = getAvailableProviders(); // ['local', 'imagekit', 'cloudinary']
const provider = await getUploadProvider(); // Get configured provider
```

## Development Setup

### Local Provider (Default)

No setup needed! Files are stored in `public/uploads/`.

```bash
# Ensure directory exists
mkdir -p public/uploads/{comics,chapters,avatars,general}
```

### ImageKit Setup

1. Create free account at https://imagekit.io
2. Get credentials from Dashboard → Developer Settings
3. Add to `.env.local`:
   ```env
   UPLOAD_PROVIDER=imagekit
   IMAGEKIT_PUBLIC_KEY=...
   IMAGEKIT_PRIVATE_KEY=...
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
   ```

### Cloudinary Setup

1. Create free account at https://cloudinary.com
2. Get credentials from Settings → Credentials
3. Add to `.env.local`:
   ```env
   UPLOAD_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

## Performance Optimization

### Image Optimization Best Practices

1. **Use Next.js Image component** - Automatic format selection and responsive
   sizes
2. **Generate responsive srcsets** - Use `getResponsiveSrcSet()` for img tags
3. **Lazy load images** - Use `loading="lazy"` attribute
4. **Compress on upload** - Sharp automatically optimizes local uploads
5. **Set proper quality** - 80-85 quality provides good balance

### CDN Caching

- ImageKit: Built-in global CDN, cached by default
- Cloudinary: Built-in global CDN, cached by default
- Local: Use Next.js Image component caching

## Error Handling

### Common Errors

**File Too Large**

```
"File size must be less than 10MB (current: 15.5MB)"
```

Solution: Compress image before upload or increase maxSize

**Invalid File Type**

```
"Invalid file type. Allowed types: jpeg, png, webp, gif"
```

Solution: Use supported image formats

**Upload Failed**

```
"Failed to upload image. Please try again."
```

Solution: Check internet connection, provider credentials, or try local provider

**Unauthorized**

```
"Unauthorized" (401)
```

Solution: Ensure user is authenticated

## Testing

### Unit Tests

```bash
pnpm test  # Run all tests
pnpm test src/lib/image.ts  # Test image utilities
pnpm test src/services/upload  # Test upload service
```

### Manual Testing

1. **Local Provider:**
   - Set `UPLOAD_PROVIDER=local`
   - Upload image via UI
   - Check `public/uploads/` directory

2. **ImageKit Provider:**
   - Set ImageKit credentials
   - Set `UPLOAD_PROVIDER=imagekit`
   - Upload and verify in ImageKit dashboard

3. **Cloudinary Provider:**
   - Set Cloudinary credentials
   - Set `UPLOAD_PROVIDER=cloudinary`
   - Upload and verify in Cloudinary dashboard

## Troubleshooting

### Issue: "Module not found" error

**Solution:** Ensure all dependencies are installed:

```bash
pnpm install
```

### Issue: Local uploads not appearing

**Solution:** Check that `public/uploads/` directory exists and is writable:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### Issue: Provider credentials not working

**Solution:**

1. Verify credentials in `.env.local`
2. Check provider account is active
3. Ensure credentials have correct permissions
4. Try local provider first to isolate issue

### Issue: Images not optimizing

**Solution:**

1. Ensure Sharp is installed: `pnpm add sharp`
2. For cloud providers, use transformation parameters
3. Check image format is supported (JPEG, PNG, WebP)

## Migration

### Switching Providers

1. **From Local to Cloud:**

   ```env
   UPLOAD_PROVIDER=imagekit  # or cloudinary
   IMAGEKIT_PUBLIC_KEY=...
   ```

   - Existing local images remain in `public/uploads/`
   - New uploads go to cloud provider
   - No data migration needed (URLs are absolute)

2. **Between Cloud Providers:**
   - URLs are absolute, no code changes needed
   - Just change `UPLOAD_PROVIDER` and credentials

## Future Enhancements

- [ ] AWS S3 provider
- [ ] Presigned URLs for direct uploads
- [ ] Batch delete endpoint
- [ ] Image CDN metrics/analytics
- [ ] Automatic WebP conversion
- [ ] Progressive image loading
- [ ] Placeholder generation (LQIP, blurhash)

## Security

### Best Practices

1. **Always validate files** - Use `validateImageFile()` on backend
2. **Limit file sizes** - Prevents DOS attacks
3. **Restrict MIME types** - Only allow image formats
4. **Use secure URLs** - HTTPS for all uploads
5. **Authenticate uploads** - Check user session before upload
6. **Tag files** - Include user ID in tags for tracking
7. **Delete old files** - Clean up unused images

### Sanitization

- Always validate MIME types, not just extensions
- Use Sharp to process/re-encode images (prevents malicious files)
- Store metadata separately from URLs
- Never execute uploaded files

## Related Documentation

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [ImageKit Documentation](https://docs.imagekit.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Sharp Image Library](https://sharp.pixelplumbing.com/)
