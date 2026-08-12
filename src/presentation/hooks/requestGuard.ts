export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';

export function createRequestGuard() {
  let requestId = 0;

  return {
    nextId(): number {
      requestId += 1;
      return requestId;
    },
    isLatest(id: number): boolean {
      return id === requestId;
    },
    getCurrentId(): number {
      return requestId;
    },
  };
}

export type RequestGuard = ReturnType<typeof createRequestGuard>;
