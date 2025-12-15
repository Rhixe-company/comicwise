// Minimal module stubs for external libs without types

declare module "cloudinary" {
  const content: any;
  export = content;
}

declare module "imagekit" {
  // Provide an ImageKit constructor/type fallback
  export type ImageKit = any;
  const ImageKitDefault: any;
  export default ImageKitDefault;
}

declare module "imagekit-javascript" {
  const content: any;
  export = content;
}

declare module "postgres" {
  const postgres: any;
  export default postgres;
}

declare module "postgres-js" {
  const postgres: any;
  export default postgres;
}

declare module "@auth/drizzle-adapter" {
  export const DrizzleAdapter: any;
  const createDrizzleAdapter: any;
  export default createDrizzleAdapter;
}

declare module "@auth/core" {
  const content: any;
  export = content;
}

declare module "@auth/core/providers/email" {
  const content: any;
  export default content;
}

declare module "@auth/drizzle-adapter/*" {
  const content: any;
  export = content;
}

// Next-auth v5 has different types; provide a safe fallback
declare module "next-auth" {
  // Provide minimal Session/User types used in the codebase
  export type Session = any;
  export type User = any;
  export interface JWT {
    [key: string]: any;
  }
  const NextAuth: any;
  export default NextAuth;
}

declare module "next-auth/providers/*" {
  const content: any;
  export default content;
}

declare module "@cld/*" {
  const content: any;
  export = content;
}

// For any other unknown imports
declare module "*-loader" {
  const content: any;
  export default content;
}
