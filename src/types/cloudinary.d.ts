declare module "cloudinary" {
  export interface ConfigOptions {
    api_key: string;
    api_secret: string;
    cloud_name: string;
    secure?: boolean;
  }

  export interface UploadOptions {
    folder?: string;
    public_id?: string;
    resource_type?: "auto" | "image" | "raw" | "video";
    tags?: string[];
    unique_filename?: boolean;
    use_filename?: boolean;
  }

  export interface UploadResult {
    bytes: number;
    created_at: string;
    format: string;
    height: number;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    type: string;
    url: string;
    version: number;
    width: number;
  }

  export interface DestroyOptions {
    invalidate?: boolean;
    resource_type?: "image" | "raw" | "video";
    type?: string;
  }

  export interface DestroyResult {
    result: "not found" | "ok";
  }

  export interface SearchOptions {
    expression: string;
    max_results?: number;
    next_cursor?: string;
  }

  export interface SearchResult {
    next_cursor?: string;
    resources: UploadResult[];
    total_count: number;
  }

  export const v2: {
    config(options: ConfigOptions): void;
    search: {
      expression(expr: string): {
        max_results(number_: number): {
          execute(): Promise<SearchResult>;
        };
      };
    };
    uploader: {
      destroy(publicId: string, options?: DestroyOptions): Promise<DestroyResult>;
      upload(file: Buffer | string, options?: UploadOptions): Promise<UploadResult>;
    };
  };
}
