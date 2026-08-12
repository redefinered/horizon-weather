export type AppErrorKind =
  | 'permission_denied'
  | 'rate_limited'
  | 'service_unavailable'
  | 'network'
  | 'unknown';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  retryable: boolean;
}

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    readonly code: 'rate_limited' | 'service_unavailable' | 'network',
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

export function mapToAppError(error: unknown): AppError {
  if (error instanceof WeatherServiceError) {
    if (error.code === 'rate_limited') {
      return {
        kind: 'rate_limited',
        message: 'Weather service is busy. Please try again shortly.',
        retryable: true,
      };
    }

    if (error.code === 'service_unavailable') {
      return {
        kind: 'service_unavailable',
        message: 'Weather service is temporarily unavailable.',
        retryable: true,
      };
    }

    return {
      kind: 'network',
      message: 'Unable to reach the weather service. Check your connection.',
      retryable: true,
    };
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('permission') || message.includes('denied')) {
      return {
        kind: 'permission_denied',
        message: error.message,
        retryable: false,
      };
    }

    if (message.includes('rate') || message.includes('429')) {
      return {
        kind: 'rate_limited',
        message: 'Weather service is busy. Please try again shortly.',
        retryable: true,
      };
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('failed to fetch')
    ) {
      return {
        kind: 'network',
        message: 'Unable to reach the weather service. Check your connection.',
        retryable: true,
      };
    }

    return {
      kind: 'unknown',
      message: error.message,
      retryable: true,
    };
  }

  return {
    kind: 'unknown',
    message: 'Something went wrong. Please try again.',
    retryable: true,
  };
}
