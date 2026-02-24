// ═══════════════════════════════════════════════════
// IMAGE UPLOAD COMPONENT - Reusable Image Upload with Preview
// ═══════════════════════════════════════════════════

"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";

import { cn } from "utils";

interface ImageUploadProps {
  accept?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  maxSize?: number; // in MB
  onChange?(url: string): void;
  onRemove?(url?: string): void;
  onUploadComplete?(url: string): void;
  type?: "avatar" | "chapter" | "comic" | "other";
  uploadType?: "avatar" | "chapter" | "comic" | "other";
  value?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  onUploadComplete,
  disabled = false,
  className,
  label = "Upload Image",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 10,
  type = "other",
  uploadType,
}: ImageUploadProps) {
  const { fileInputRef, isUploading, error, handleFileSelect } = useImageUpload({
    maxSizeMB: maxSize,
    uploadType: uploadType || type,
    onChange,
    onUploadComplete,
  });

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
              bg-muted/50 hover:bg-muted flex aspect-video w-full max-w-md
              cursor-pointer flex-col items-center justify-center gap-2
              rounded-lg border-2 border-dashed
              transition-colors
            `,
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
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
        <div
          className={`
          bg-destructive/15 text-destructive rounded-md p-3 text-sm
        `}
        >
          {error}
        </div>
      )}
    </div>
  );
}
