// ═══════════════════════════════════════════════════
// CLI TYPES - Command Line Interface
// ═══════════════════════════════════════════════════

/**
 * CLI command
 */
export interface CliCommand {
  action(...args: any[]): Promise<void> | void;
  aliases?: string[];
  category: CliCommandCategory;
  description: string;
  examples?: string[];
  name: string;
  options?: CliCommandOption[];
}

/**
 * CLI command category
 */
export type CliCommandCategory =
  | "build"
  | "cache"
  | "database"
  | "deployment"
  | "development"
  | "email"
  | "maintenance"
  | "monitoring"
  | "queue"
  | "testing"
  | "upload"
  | "utilities";

/**
 * CLI command option
 */
export interface CliCommandOption {
  choices?: string[];
  default?: boolean | number | string;
  description: string;
  flag: string;
  required?: boolean;
}

/**
 * CLI output formatter
 */
export interface CliFormatter {
  error(message: string): void;
  info(message: string): void;
  json(data: unknown): void;
  success(message: string): void;
  table(data: Record<string, unknown>[]): void;
  warning(message: string): void;
}

/**
 * CLI progress indicator
 */
export interface CliProgress {
  increment(message?: string): void;
  start(total: number, message?: string): void;
  stop(message?: string): void;
  update(current: number, message?: string): void;
}

/**
 * Script metadata
 */
export interface ScriptMetadata {
  author?: string;
  category: CliCommandCategory;
  dependencies?: string[];
  description: string;
  examples?: string[];
  name: string;
  tags: string[];
  version?: string;
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  args?: string[];
  command: string;
  description: string;
  env?: Record<string, string>;
  name: string;
  optional?: boolean;
  retryOnFail?: boolean;
  timeout?: number;
}

/**
 * Workflow definition
 */
export interface WorkflowDefinition {
  description: string;
  name: string;
  onFailure?: string;
  onSuccess?: string;
  steps: WorkflowStep[];
}
