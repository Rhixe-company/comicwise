declare module "zxcvbn-ts/core" {
  export interface ZxcvbnResult {
    calc_time: number;
    feedatabaseack: {
      suggestions: string[];
      warning: string;
    };
    guesses: number;
    guesses_log10: number;
    score: 0 | 1 | 2 | 3 | 4;
    sequence: Array<{
      guesses: number;
      pattern: string;
      token: string;
    }>;
  }

  export interface ZxcvbnOptions {
    dictionary?: {
      userInputs?: string[];
    };
    graphs?: Record<string, unknown>;
    translations?: Record<string, unknown>;
  }

  export function zxcvbn(password: string, userInputs?: string[]): ZxcvbnResult;
  export function zxcvbnOptions(options: ZxcvbnOptions): void;
}

declare module "zxcvbn-ts/language-common" {
  export const dictionary: {
    names: string[];
    passwords: string[];
    surnames: string[];
  };
}

declare module "zxcvbn-ts/language-en" {
  export const dictionary: {
    names: string[];
    passwords: string[];
    surnames: string[];
  };
  export const translations: Record<string, string>;
}
