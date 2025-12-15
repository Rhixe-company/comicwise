// Ambient module to provide typed aliases for imports from "database".
// This lets code `import { database, tables, Database } from "database"`
// receive accurate types derived from the real implementations without
// causing duplicate-declaration issues.

declare module "database" {
  // The runtime `database` object (Drizzle client) — use the exported
  // `Database` type from `database/db` so consumers see the proper
  // `query` helpers and table bindings.
  export const database: import("../database/db").Database;
  // export const client: import("../database/db").client;
  export const tables: import("../database/db").Schema;

  export type Database = import("../database/db").Database;
  export type Schema = import("../database/db").Schema;
}
