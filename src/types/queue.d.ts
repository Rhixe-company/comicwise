// ═══════════════════════════════════════════════════
// QUEUE TYPES - Background Jobs
// ═══════════════════════════════════════════════════

/**
 * Job status
 */
export type JobStatus = "active" | "completed" | "delayed" | "failed" | "paused" | "waiting";

/**
 * Job priority
 */
export type JobPriority = "critical" | "high" | "low" | "normal";

/**
 * Queue job
 */
export interface QueueJob<T = unknown> {
  attemptsMade: number;
  data: T;
  failedReason?: string;
  finishedOn?: number;
  id: string;
  name: string;
  opts?: QueueJobOptions;
  processedOn?: number;
  progress?: number;
  returnValue?: unknown;
  stacktrace?: string[];
  status: JobStatus;
  timestamp: number;
}

/**
 * Queue job options
 */
export interface QueueJobOptions {
  attempts?: number;
  backoff?: { delay: number; type: string; } | number;
  delay?: number;
  jobId?: string;
  lifo?: boolean;
  priority?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  stackTraceLimit?: number;
  timeout?: number;
}

/**
 * Queue statistics
 */
export interface QueueStats {
  active: number;
  completed: number;
  delayed: number;
  failed: number;
  paused: number;
  waiting: number;
}

/**
 * Email job data
 */
export interface EmailJobData {
  attachments?: Array<{
    content: Buffer | string;
    encoding?: string;
    filename: string;
  }>;
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string;
}

/**
 * Image processing job data
 */
export interface ImageProcessingJobData {
  operations: Array<{
    params: Record<string, unknown>;
    type: "compress" | "crop" | "resize" | "watermark";
  }>;
  outputFormat?: "avif" | "jpeg" | "png" | "webp";
  quality?: number;
  sourceUrl: string;
}

/**
 * Notification job data
 */
export interface NotificationJobData {
  data?: Record<string, unknown>;
  message: string;
  title: string;
  type: "email" | "push" | "sms";
  userId: string;
}
