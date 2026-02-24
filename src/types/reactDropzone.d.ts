// Minimal react-dropzone types needed by the project
declare module "react-dropzone" {
  import type * as React from "react";

  export interface FileWithPath extends File {
    path?: string;
  }

  export type DropEvent = React.DragEvent<HTMLElement> | React.SyntheticEvent<any>;

  export interface DropzoneOptions {
    accept?: Record<string, string[]> | string;
    multiple?: boolean;
  }

  export function useDropzone(options?: DropzoneOptions): {
    acceptedFiles: FileWithPath[];
    fileRejections: Array<any>;
    getInputProps(props?: any): any;
    getRootProps(props?: any): any;
    isDragAccept: boolean;
    isDragActive: boolean;
    isDragReject: boolean;
    open(): void;
  };

  export const Dropzone: React.FC<any>;
  export default useDropzone;
}
