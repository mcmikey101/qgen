import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

export function useAsync<T>(request: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  const run = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      setState({ status: 'success', data: await request() });
    } catch (error) {
      setState({ status: 'error', error: error instanceof Error ? error.message : 'Произошла ошибка' });
    }
  }, [request]);

  useEffect(() => {
    void run();
  }, [run]);

  return { state, retry: run };
}
