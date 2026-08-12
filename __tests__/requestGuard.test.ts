import { createRequestGuard } from '../src/presentation/hooks/requestGuard';

describe('createRequestGuard', () => {
  it('increments request ids monotonically', () => {
    const guard = createRequestGuard();

    expect(guard.nextId()).toBe(1);
    expect(guard.nextId()).toBe(2);
    expect(guard.nextId()).toBe(3);
  });

  it('marks only the latest id as current', () => {
    const guard = createRequestGuard();
    const first = guard.nextId();
    const second = guard.nextId();

    expect(guard.isLatest(first)).toBe(false);
    expect(guard.isLatest(second)).toBe(true);
    expect(guard.getCurrentId()).toBe(second);
  });

  it('discards stale responses when a newer request starts', async () => {
    const guard = createRequestGuard();
    const results: string[] = [];

    const runRequest = async (id: number, label: string, delayMs: number) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (guard.isLatest(id)) {
        results.push(label);
      }
    };

    const slowId = guard.nextId();
    const fastId = guard.nextId();

    await Promise.all([
      runRequest(slowId, 'slow', 30),
      runRequest(fastId, 'fast', 5),
    ]);

    expect(results).toEqual(['fast']);
  });
});

describe('useWeather stale-safe behavior', () => {
  it('ignores out-of-order completions using the request guard contract', async () => {
    const guard = createRequestGuard();
    let appliedResult: number | null = null;

    const simulateRefresh = async (value: number, delayMs: number) => {
      const id = guard.nextId();
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (guard.isLatest(id)) {
        appliedResult = value;
      }
    };

    await Promise.all([simulateRefresh(1, 25), simulateRefresh(2, 5)]);

    expect(appliedResult).toBe(2);
  });
});
