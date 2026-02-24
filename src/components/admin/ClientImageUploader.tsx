"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";

import { cn } from "utils";

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT IMAGE UPLOADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ClientImageUploaderProps {
  accept?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  maxSize?: number; // in MB
  onChange?(url: string): void;
  onRemove?(url?: string): void;
  onUploadComplete?(url: string): void;
  /** deprecated Not used, kept for backward compatibility */
  targetInputId?: string;
  type?: "avatar" | "chapter-image" | "comic-cover" | "general";
  uploadType?: "avatar" | "chapter-image" | "comic-cover" | "general";
  value?: string;
}

/**
 * Client-side image uploader component with preview and drag-and-drop support
 *
 * Features:
 * - Drag and drop support
 * - File preview before upload
 * - Progress indicator
 * - Error handling
 * - Responsive design
 *
 * example
 * ```tsx
 * <ClientImageUploader
 *   value={imageUrl}
 *   onChange={setImageUrl}
 *   onUploadComplete={saveToDb}
 *   type="comic-cover"
 *   maxSize={10}
 * />
 * ```
 * @param root0
 * @param root0.value
 * @param root0.onChange
 * @param root0.onRemove
 * @param root0.onUploadComplete
 * @param root0.disabled
 * @param root0.className
 * @param root0.label
 * @param root0.accept
 * @param root0.maxSize
 * @param root0.type
 * @param root0.uploadType
 * @param root0.targetInputId
 */
export default function ClientImageUploader({
  value,
  onChange,
  onRemove,
  onUploadComplete,
  disabled = false,
  className,
  label = "Upload Image",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 10,
  type = "general",
  uploadType,
  targetInputId: _targetInputId, // kept for backward compatibility but unused
}: ClientImageUploaderProps) {
  const { fileInputRef, isUploading, uploadProgress, error, handleFileSelect } = useImageUpload({
    maxSizeMB: maxSize,
    uploadType: uploadType || type,
    onChange,
    onUploadComplete,
  });

  // Handle drag and drop
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled, isUploading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled || isUploading) return;
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const event = {
          target: { files },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileSelect(event);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleRemove = () => {
    if (onRemove) {
      onRemove(value);
    } else if (onChange) {
      onChange("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div
          className={`
            bg-muted relative aspect-video w-full max-w-md overflow-hidden
            rounded-lg border
          `}
        >
          <Image
            alt="Uploaded image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={value}
          />
          <Button
            className="absolute top-2 right-2"
            disabled={disabled}
            onClick={handleRemove}
            size="icon"
            type="button"
            variant="destructive"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          aria-disabled={disabled}
          className={cn(
            `
              bg-muted/50 hover:bg-muted relative flex aspect-video w-full max-w-md
              cursor-pointer flex-col items-center justify-center gap-2
              rounded-lg border-2 border-dashed
              transition-colors
            `,
            disabled && "cursor-not-allowed opacity-50",
            isUploading && "opacity-75"
          )}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (!disabled && !isUploading && (e.key === "Enter" || e.key === " ")) {
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
        >
          {isUploading ? (
            <>
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Uploading...</p>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="bg-muted w-32 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-1 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {uploadProgress > 0 && (
                <p className="text-muted-foreground text-xs">{uploadProgress}%</p>
              )}
            </>
          ) : (
            <>
              <Upload className="text-muted-foreground size-8" />
              <div className="text-center">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-muted-foreground text-xs">Click to browse or drag and drop</p>
                <p className="text-muted-foreground text-xs">
                  Max {maxSize}MB • JPG, PNG, WebP, GIF
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        accept={accept}
        aria-label={`Upload ${label}`}
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleFileSelect}
        ref={fileInputRef}
        title={`Upload ${label}`}
        type="file"
      />

      {error && (
        <div className={`bg-destructive/15 text-destructive rounded-md p-3 text-sm`}>{error}</div>
      )}
    </div>
  );
}
