const DEMO_DELAY_MS = 600;

export function demoRequest<T>(data: T, delay = DEMO_DELAY_MS): Promise<T> {
  const shouldFail = new URLSearchParams(window.location.search).has('demoError');
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) reject(new Error('Сервер недоступен. Попробуйте повторить запрос.'));
      else resolve(structuredClone(data));
    }, delay);
  });
}
