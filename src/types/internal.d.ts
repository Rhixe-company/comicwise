// Internal types for actions and API
export interface ActionResult<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  success: boolean;
}

export type ActionResponse<T = unknown> = ActionResult<T>;

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface SendEmailOptions {
  bcc?: string | string[];
  cc?: string | string[];
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  to: string;
}
