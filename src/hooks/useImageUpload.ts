import { useRef, useState } from "react";

const DEFAULT_ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  uploadType?: string;
  onChange?(url: string): void;
  onUploadComplete?(url: string): void;
}

export interface UseImageUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
  handleFileSelect(e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
  reset(): void;
}

/**
 * Hook encapsulating image validation and POST upload logic used by admin image upload components.
 *
 * This isolates side effects and state so the UI component can focus on presentation.
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSizeMB = 10,
    allowedTypes = DEFAULT_ALLOWED,
    uploadType,
    onChange,
    onUploadComplete,
  } = options;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Validate the selected file for type and size.
   * Returns null when valid, otherwise an error message string.
   */
  function validateFile(file: File): string | null {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}`;
    }
    return null;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      if (uploadType) formData.append("type", uploadType);

      // Simulate progress for UX since fetch doesn't expose upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.url) throw new Error("No URL returned from upload");

      setSuccess(true);
      onChange?.(data.url);
      onUploadComplete?.(data.url);

      // Clear success state after short delay
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function reset() {
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return {
    fileInputRef,
    isUploading,
    uploadProgress,
    error,
    success,
    handleFileSelect,
    reset,
  };
}
