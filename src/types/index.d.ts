// Central place for custom type declarations and stubs
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.webp";

// Allow importing raw text for fixtures
declare module "*.txt" {
  const content: string;
  export default content;
}

// App-specific global types
declare global {
  type Nullable<T> = T | null | undefined;
}

export {};
// AUTO-GENERATED index for local stub types
/// <reference path="./simplewebauthn__server.d.ts" />
/// <reference path="./tailwindcss__postcss.d.ts" />
/// <reference path="./typescript-eslint__parser.d.ts" />
/// <reference path="./vitejs__plugin-react.d.ts" />
/// <reference path="./babel-plugin-react-compiler.d.ts" />
/// <reference path="./dotenv-safe.d.ts" />
/// <reference path="./es-abstract.d.ts" />
/// <reference path="./eslint-config-next.d.ts" />
/// <reference path="./eslint-plugin-better-tailwindcss.d.ts" />
/// <reference path="./eslint-plugin-drizzle.d.ts" />
/// <reference path="./eslint-plugin-security.d.ts" />
/// <reference path="./eslint-plugin-zod.d.ts" />
/// <reference path="./happy-dom.d.ts" />
/// <reference path="./media-chrome.d.ts" />
/// <reference path="./postcss-import.d.ts" />
/// <reference path="./react-email.d.ts" />
/// <reference path="./react-fast-marquee.d.ts" />
/// <reference path="./server-only.d.ts" />
/// <reference path="./shadcn.d.ts" />
/// <reference path="./tailwindcss.d.ts" />
/// <reference path="./tsx.d.ts" />
/// <reference path="./tw-animate-css.d.ts" />
export {};
