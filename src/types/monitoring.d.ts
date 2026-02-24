// ═══════════════════════════════════════════════════
// MONITORING TYPES - System Health & Metrics
// ═══════════════════════════════════════════════════

/**
 * System health status
 */
export type HealthStatus = "degraded" | "healthy" | "unhealthy";

/**
 * System health check result
 */
export interface HealthCheckResult {
  metrics?: SystemMetrics;
  services: Record<string, ServiceHealthCheck>;
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
}

/**
 * Service health check
 */
export interface ServiceHealthCheck {
  details?: Record<string, unknown>;
  lastChecked: string;
  latency?: number;
  message?: string;
  status: "degraded" | "down" | "up";
}

/**
 * System metrics
 */
export interface SystemMetrics {
  cpu: CpuMetrics;
  disk?: DiskMetrics;
  memory: MemoryMetrics;
  network?: NetworkMetrics;
}

/**
 * CPU metrics
 */
export interface CpuMetrics {
  cores: number;
  loadAverage: number[];
  usage: number;
}

/**
 * Memory metrics
 */
export interface MemoryMetrics {
  free: number;
  total: number;
  usagePercent: number;
  used: number;
}

/**
 * Disk metrics
 */
export interface DiskMetrics {
  free: number;
  total: number;
  usagePercent: number;
  used: number;
}

/**
 * Network metrics
 */
export interface NetworkMetrics {
  bytesReceived: number;
  bytesSent: number;
  requestsPerSecond: number;
}

/**
 * Performance metric
 */
export interface PerformanceMetric {
  name: string;
  tags?: Record<string, string>;
  timestamp: string;
  unit: string;
  value: number;
}

/**
 * Error tracking
 */
export interface ErrorTracking {
  context?: Record<string, unknown>;
  id: string;
  level: "error" | "info" | "warning";
  message: string;
  stack?: string;
  timestamp: string;
  user?: {
    email?: string;
    id: string;
  };
}

/**
 * CI/CD status
 */
export interface CiCdStatus {
  branch: string;
  commit: string;
  completedAt?: string;
  duration?: number;
  jobs: CiCdJob[];
  startedAt: string;
  status: "cancelled" | "failure" | "pending" | "success";
  triggeredBy: string;
  workflowName: string;
}

/**
 * CI/CD job
 */
export interface CiCdJob {
  completedAt?: string;
  duration?: number;
  name: string;
  startedAt: string;
  status: "failure" | "pending" | "skipped" | "success";
  steps: CiCdStep[];
}

/**
 * CI/CD step
 */
export interface CiCdStep {
  duration?: number;
  name: string;
  output?: string;
  status: "failure" | "pending" | "skipped" | "success";
}
