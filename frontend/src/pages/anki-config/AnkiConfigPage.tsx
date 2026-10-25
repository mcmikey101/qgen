import React from "react";
import { ANKI_URL, invokeAnki } from "../../shared/api/ankiConnect";
import "./AnkiConfig.css";

import { useAsync } from "../../shared/lib/useAsync";

type ConnectionStatus = "checking" | "connected" | "disconnected";

type AnkiInfo = {
  version: number;
  decks: string[];
  noteTypes: string[];
};

async function fetchAnkiInfo(): Promise<AnkiInfo> {
  const version = await invokeAnki<number>("version");
  const [decks, noteTypes] = await Promise.all([
    invokeAnki<string[]>("deckNames"),
    invokeAnki<string[]>("modelNames"),
  ]);
  return { version, decks, noteTypes };
}

const AnkiConfigPage: React.FC = () => {
  // Соединение проверяется сразу при открытии экрана (раньше статус навсегда оставался «Проверка...»).
  const { state, retry: checkConnection } = useAsync(fetchAnkiInfo);

  const status: ConnectionStatus =
    state.status === "loading" ? "checking" : state.status === "success" ? "connected" : "disconnected";
  const loading = state.status === "loading";
  const error = state.status === "error" ? state.error : "";
  const version = state.status === "success" ? state.data.version : null;
  const decks = state.status === "success" ? state.data.decks : [];
  const noteTypes = state.status === "success" ? state.data.noteTypes : [];

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
            onClick={checkConnection}
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
          <div className="anki-error fade-in" role="alert">
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

          {status === "checking" ? (
            <p className="anki-empty">Загружаем данные из Anki…</p>
          ) : status !== "connected" ? (
            <p className="anki-empty">
              Колоды появятся после подключения.
            </p>
          ) : decks.length === 0 ? (
            <p className="anki-empty">Колоды не найдены.</p>
          ) : (
            <ul className="anki-list appear">
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

          {status === "checking" ? (
            <p className="anki-empty">Загружаем данные из Anki…</p>
          ) : status !== "connected" ? (
            <p className="anki-empty">
              Типы заметок появятся после подключения.
            </p>
          ) : noteTypes.length === 0 ? (
            <p className="anki-empty">
              Типы заметок не найдены.
            </p>
          ) : (
            <ul className="anki-list appear">
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

export default AnkiConfigPage;
