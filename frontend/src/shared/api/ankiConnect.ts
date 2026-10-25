export const ANKI_URL = 'http://127.0.0.1:8765';

type AnkiResponse<T> = { result: T; error: string | null };

export async function invokeAnki<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(ANKI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, version: 6, params }),
    });
  } catch {
    throw new Error(
      'Anki недоступен. Запустите Anki Desktop и проверьте установку AnkiConnect. Также проверьте разрешение браузера на доступ к локальной сети.',
    );
  }
  if (!response.ok) throw new Error(`Ошибка AnkiConnect: HTTP ${response.status}`);
  const data = (await response.json()) as AnkiResponse<T>;
  if (data.error) throw new Error(data.error);
  return data.result;
}
