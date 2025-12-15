# Image Upload - Quick Reference

## Files Overview

| File                                           | Purpose                        | Key Exports                                                  |
| ---------------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `src/lib/image.ts`                             | URL & transformation utilities | `getImageUrl()`, `transformImage()`, `getResponsiveSrcSet()` |
| `src/services/upload/types.ts`                 | Type definitions               | `UploadType`, `UploadProvider`, `UPLOAD_CONSTRAINTS`         |
| `src/services/upload/factory.ts`               | Provider selection             | `getUploadProvider()`, `getAvailableProviders()`             |
| `src/services/upload/index.ts`                 | Main API                       | `uploadImage()`, `deleteImage()`, `getImageUrl()`            |
| `src/hooks/useImageUpload.ts`                  | React hook                     | `useImageUpload()`                                           |
| `src/components/admin/ClientImageUploader.tsx` | UI component                   | `ClientImageUploader`                                        |

## Common Tasks

### Upload an Image

```tsx
import { useImageUpload } from "@/hooks/useImageUpload";

const { fileInputRef, isUploading, error, handleFileSelect } = useImageUpload({
  maxSizeMB: 10,
  uploadType: "comic-cover",
  onChange: (url) => console.log("URL:", url),
});
```

### Display Image with Optimization

```tsx
import { getImageUrl } from "@/lib/image";
import Image from "next/image";

<Image
  src={getImageUrl(imageUrl)}
  alt="Comic cover"
  width={300}
  height={450}
  quality={85}
/>;
```

### Generate Responsive Images

```tsx
import { getResponsiveSrcSet } from "@/lib/image";

<img
  src={imageUrl}
  srcSet={getResponsiveSrcSet(imageUrl)}
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Comic"
/>;
```

### Transform Image URL

```tsx
import { transformImage } from "@/lib/image";

const thumbUrl = transformImage(imageUrl, 300, 300, 80); // width, height, quality
```

### Server-Side Upload

```tsx
import { uploadImage } from "@/services/upload";

const result = await uploadImage(file, {
  folder: "comics",
  filename: "cover",
  tags: ["comic", "cover"],
});

console.log(result.url); // Public URL
```

### Check Provider Availability

```tsx
import {
  getAvailableProviders,
  getConfiguredProvider,
} from "@/services/upload";

const configured = getConfiguredProvider(); // 'local' | 'imagekit' | 'cloudinary'
const available = getAvailableProviders(); // ['local', ...]
```

## Configuration

### .env.local Setup

**Local (Default)**

```env
UPLOAD_PROVIDER=local
# No credentials needed
```

**ImageKit**

```env
UPLOAD_PROVIDER=imagekit
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

**Cloudinary**

```env
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Upload Types & Constraints

```typescript
'comic-cover':     { maxSizeMB: 10, types: ['jpeg', 'png', 'webp'] }
'chapter-image':   { maxSizeMB: 10, types: ['jpeg', 'png', 'webp'] }
'avatar':          { maxSizeMB: 5,  types: ['jpeg', 'png', 'webp'] }
'general':         { maxSizeMB: 10, types: ['jpeg', 'png', 'webp', 'gif'] }
```

## Component Props

### ClientImageUploader

```tsx
<ClientImageUploader
  value={string}                    // Current image URL
  onChange={(url) => void}          // Called on upload
  onRemove?={(url) => void}         // Called on remove
  onUploadComplete?={(url) => void} // Called when done
  disabled?={boolean}               // Disable upload
  type="comic-cover"                // Upload type
  label="Upload Image"              // Button label
  maxSize={10}                       // Max MB
  accept="image/*"                  // File types
/>
```

### useImageUpload Hook

```tsx
const {
  fileInputRef, // Attach to input
  isUploading, // Loading state
  uploadProgress, // 0-100%
  error, // Error message
  success, // Success flag
  handleFileSelect, // onChange handler
  reset, // Reset state
} = useImageUpload({
  maxSizeMB: 10,
  allowedTypes: ["image/jpeg"],
  uploadType: "comic-cover",
  onChange: (url) => {},
  onUploadComplete: (url) => {},
});
```

## API Endpoints

### POST /api/upload

Upload single file

**Request:** FormData

```
file: File
type: 'comic-cover' | 'chapter-image' | 'avatar' | 'general'
entityId?: string
sequence?: number
```

**Response:**

```json
{
  "fileId": "public-id",
  "size": 102400,
  "success": true,
  "url": "https://..."
}
```

### PUT /api/upload

Batch upload files

**Request:** FormData with multiple `files`

**Response:**

```json
{
  "success": true,
  "uploaded": 5,
  "failed": 0,
  "results": [{...}]
}
```

## Error Handling

### Common Errors

```
"File size must be less than 10MB (current: 15.5MB)"
→ User needs to compress or choose smaller file

"Invalid file type. Allowed types: jpeg, png, webp"
→ User needs to choose supported format

"Failed to upload image. Please try again."
→ Network or server issue, retry

"Unauthorized" (401)
→ User not authenticated
```

## Performance Tips

1. **Use Next.js Image Component**

   ```tsx
   import Image from "next/image";
   <Image src={url} alt="" width={300} height={450} quality={85} />;
   ```

2. **Generate Responsive Srcsets**

   ```tsx
   srcSet={getResponsiveSrcSet(url, [320, 640, 1024])}
   ```

3. **Lazy Load Images**

   ```tsx
   <img loading="lazy" src={url} />
   ```

4. **Set Proper Quality**
   - 80-85 for good balance
   - 75 for thumbnails
   - 90+ for high-quality displays

5. **Use CDN Properly**
   - Local: Use Next.js Image caching
   - ImageKit/Cloudinary: Built-in CDN

## Debugging

### Check Provider

```tsx
import { getConfiguredProvider } from "@/services/upload";
console.log(getConfiguredProvider()); // 'local' | 'imagekit' | 'cloudinary'
```

### Check Available Providers

```tsx
import { getAvailableProviders } from "@/services/upload";
console.log(getAvailableProviders()); // ['local', ...]
```

### Validate Image URL

```tsx
import { isValidImageUrl } from "@/lib/image";
if (!isValidImageUrl(url)) {
  console.error("Invalid image URL");
}
```

### Get Public ID from URL

```tsx
import { getPublicIdFromUrl } from "@/lib/image";
const id = getPublicIdFromUrl(url);
console.log(id); // 'comics/cover.jpg'
```

## TypeScript Types

```typescript
// Import all types
import type {
  UploadType, // 'comic-cover' | 'chapter-image' | ...
  UploadProviderType, // 'local' | 'imagekit' | 'cloudinary'
  UploadResult, // { url, publicId, size, ... }
  UploadProvider, // Interface for providers
  UploadConstraints, // { maxSizeMB, allowedMimeTypes, ... }
  ImageTransformation, // { width?, height?, quality?, ... }
} from "@/services/upload";

import type {
  UseImageUploadOptions,
  UseImageUploadReturn,
} from "@/hooks/useImageUpload";
```

## Testing Checklist

- [ ] Local upload works (files in `public/uploads/`)
- [ ] ImageKit upload works (if configured)
- [ ] Cloudinary upload works (if configured)
- [ ] Provider switching works (change .env, re-upload)
- [ ] File validation works (reject large/wrong type)
- [ ] Progress tracking shows (0-100%)
- [ ] Error messages display correctly
- [ ] Images display with Next.js Image component
- [ ] Responsive srcsets work
- [ ] Drag and drop works

## Support

See `IMAGE_UPLOAD_INFRASTRUCTURE.md` for:

- Complete architecture documentation
- Detailed setup instructions
- Troubleshooting guide
- Security best practices
- Performance optimization
- Testing strategies
