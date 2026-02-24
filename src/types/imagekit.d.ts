declare module "imagekit" {
  export interface ImageKitOptions {
    privateKey: string;
    publicKey: string;
    urlEndpoint: string;
  }

  export interface UploadOptions {
    file: Buffer | string;
    fileName: string;
    folder?: string;
    responseFields?: string[];
    tags?: string[];
    useUniqueFileName?: boolean;
  }

  export interface UploadResponse {
    fileId: string;
    filePath: string;
    fileType: string;
    height: number;
    name: string;
    size: number;
    thumbnailUrl: string;
    url: string;
    width: number;
  }

  export interface DeleteFileOptions {
    fileId: string;
  }

  export interface ListFilesOptions {
    limit?: number;
    path?: string;
    searchQuery?: string;
    skip?: number;
  }

  export interface FileObject {
    createdAt: string;
    fileId: string;
    filePath: string;
    fileType: string;
    height?: number;
    name: string;
    size: number;
    thumbnailUrl?: string;
    updatedAt: string;
    url: string;
    width?: number;
  }

  export default class ImageKit {
    getAuthenticationParameters(): { expire: number; signature: string; token: string } {
      throw new Error("Method not implemented.");
    }
    url(argument0: { path: string; transformation: { [key: string]: number | string }[] }): string {
      throw new Error("Method not implemented.");
    }
    getFileMetadata(fileId: string) {
      throw new Error("Method not implemented.");
    }
    constructor(options: ImageKitOptions);
    upload(options: UploadOptions): Promise<UploadResponse>;
    deleteFile(options: DeleteFileOptions): Promise<void>;
    listFiles(options?: ListFilesOptions): Promise<FileObject[]>;
    getFileDetails(fileId: string): Promise<FileObject>;
  }
}
