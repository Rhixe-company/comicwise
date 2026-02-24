declare module "upstash/redis" {
  export interface RedisConfig {
    token: string;
    url: string;
  }

  /**
   *
   */
  export class Redis {
    /**
     *
     */
    constructor(config: RedisConfig);
    /**
     *
     */
    get<T = string>(key: string): Promise<null | T>;
    /**
     *
     */
    set(
      key: string,
      value: number | object | string,
      options?: { ex?: number; nx?: boolean; px?: number; xx?: boolean }
    ): Promise<"OK" | null>;
    /**
     *
     */
    del(...keys: string[]): Promise<number>;
    /**
     *
     */
    incr(key: string): Promise<number>;
    /**
     *
     */
    decr(key: string): Promise<number>;
    /**
     *
     */
    expire(key: string, seconds: number): Promise<number>;
    /**
     *
     */
    ttl(key: string): Promise<number>;
    /**
     *
     */
    exists(...keys: string[]): Promise<number>;
    /**
     *
     */
    keys(pattern: string): Promise<string[]>;
    /**
     *
     */
    flushdatabase(): Promise<"OK">;
  }
}

declare module "upstash/qstash" {
  export interface QStashConfig {
    token: string;
  }

  export interface PublishOptions {
    body?: object | string;
    delay?: number;
    headers?: Record<string, string>;
    notBefore?: number;
    retries?: number;
    url: string;
  }

  export interface PublishResponse {
    messageId: string;
  }

  export interface VerifyOptions {
    body: string;
    signature: string;
    url: string;
  }

  /**
   *
   */
  export class Client {
    /**
     *
     */
    constructor(config: QStashConfig);
    /**
     *
     */
    publishJSON(options: PublishOptions): Promise<PublishResponse>;
    /**
     *
     */
    verify(options: VerifyOptions): Promise<boolean>;
  }

  /**
   *
   */
  export class Receiver {
    /**
     *
     */
    constructor(options: { currentSigningKey: string; nextSigningKey: string });
    /**
     *
     */
    verify(options: { body: string; signature: string; url?: string }): Promise<boolean>;
  }
}
