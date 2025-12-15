// Internal module aliases and common global types

declare module "appConfig" {
  import type { Env } from "src/app-config/env";

  const appConfig: any;
  const env: Env;
  const isDevelopment: boolean;
  const isProduction: boolean;
  function checkRateLimit(...args: any[]): any;
  function clearRateLimit(...args: any[]): any;
  function getRateLimitStatus(...args: any[]): any;
  export {
    appConfig,
    checkRateLimit,
    clearRateLimit,
    env,
    getRateLimitStatus,
    isDevelopment,
    isProduction,
  };
}

declare module "db" {
  const db: any;
  export type Database = any;
  export const db: any;
  export default db;
}

declare module "database/schema" {
  const content: any;
  export = content;
}

declare module "lib/*" {
  const content: any;
  export default content;
}
