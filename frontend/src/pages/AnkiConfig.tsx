
import React, { useCallback, useState } from "react";
import "../css/AnkiConfig.css";

const ANKI_URL = "http://127.0.0.1:8765";

type AnkiResponse<T> = {
  result: T;
  error: string | null;
};

type ConnectionStatus = "checking" | "connected" | "disconnected";

async function invoke<T>(
  action: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(ANKI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        version: 6,
      }),
    });
  } catch {
    throw new Error(
      "Anki недоступен. Запусти Anki Desktop и проверь установку AnkiConnect. Также проверь разрешение браузера на доступ к локальной сети.",
    );
  }

  if (!response.ok) {
    throw new Error(`Ошибка AnkiConnect: HTTP ${response.status}`);
  }

  const data = (await response.json()) as AnkiResponse<T>;

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

const AnkiConfig: React.FC = () => {
  const [status, setStatus] =
    useState<ConnectionStatus>("checking");

  const [version, setVersion] = useState<number | null>(null);
  const [decks, setDecks] = useState<string[]>([]);
  const [noteTypes, setNoteTypes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkConnection = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const currentVersion = await invoke<number>("version");

      const [availableDecks, availableNoteTypes] = await Promise.all([
        invoke<string[]>("deckNames"),
        invoke<string[]>("modelNames"),
      ]);

      setVersion(currentVersion);
      setDecks(availableDecks);
      setNoteTypes(availableNoteTypes);
      setStatus("connected");
    } catch (e) {
      setStatus("disconnected");
      setVersion(null);
      setDecks([]);
      setNoteTypes([]);

      setError(
        e instanceof Error
          ? e.message
          : "Не удалось подключиться к Anki.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="anki-config">
      <header className="anki-header">
        <div>
          <h1>Подключение к Anki</h1>
          <p>
            Статус локального подключения и доступные ресурсы Anki.
          </p>
        </div>

        <span
          className={`anki-status ${
            status === "connected"
              ? "is-connected"
              : status === "checking"
                ? "is-checking"
                : "is-disconnected"
          }`}
        >
          <span className="status-dot" />
          {status === "connected"
            ? "Подключено"
            : status === "checking"
              ? "Проверка..."
              : "Нет соединения"}
        </span>
      </header>

      <section className="anki-panel">
        <div className="anki-section-heading">
          <h2>Состояние соединения</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={() => void checkConnection()}
            disabled={loading}
          >
            {loading ? "Проверка..." : "Проверить сейчас"}
          </button>
        </div>

        <div className="anki-detail">
          <span className="anki-muted">Локальный адрес: </span>
          <code>{ANKI_URL}</code>
        </div>

        <div className="anki-detail">
          <span className="anki-muted">Версия AnkiConnect API: </span>
          <strong>{version ?? " — "}</strong>
        </div>

        {error && (
          <div className="anki-error" role="alert">
            {error}
          </div>
        )}
      </section>

      <div className="anki-resource-grid">
        <section className="anki-panel">
          <div className="anki-section-heading">
            <h2>Доступные колоды</h2>
            <span className="anki-count">{decks.length}</span>
          </div>

          {status !== "connected" ? (
            <p className="anki-empty">
              Колоды появятся после подключения.
            </p>
          ) : decks.length === 0 ? (
            <p className="anki-empty">Колоды не найдены.</p>
          ) : (
            <ul className="anki-list">
              {decks.map((deck) => (
                <li key={deck} className="anki-list-item">
                  <span>{deck}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="anki-panel">
          <div className="anki-section-heading">
            <h2>Типы заметок</h2>
            <span className="anki-count">{noteTypes.length}</span>
          </div>

          {status !== "connected" ? (
            <p className="anki-empty">
              Типы заметок появятся после подключения.
            </p>
          ) : noteTypes.length === 0 ? (
            <p className="anki-empty">
              Типы заметок не найдены.
            </p>
          ) : (
            <ul className="anki-list">
              {noteTypes.map((noteType) => (
                <li key={noteType} className="anki-list-item">
                  <span>{noteType}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default AnkiConfig;
