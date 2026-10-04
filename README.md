# qgen

## Цель проекта

Создание платформы для конвертации pdf/md/txt файлов с конспектами/статьями/образовательным материалом в пары вопрос-ответ и удобным импортированием в приложение Anki для более эффективного изучения и подготовки. 

## Этапы проекта

## Каркас frontend

### Основное назначение приложения и пользовательские экраны

Приложение предназначено для преобразования неструктурированного текста в отдельные карточки для более удобного изучения.
- Основной экран должен содержать список колод с карточками, поиск по названию и фильтр по тэгам.
Каждая колода содержит карточки, которые можно свободно просматривать, редактировать и удалять.
Колодами также можно делиться с другими пользователями
- Второй экран содержит список публичных колод, которыми делятся между собой пользователи, поиск по названию и тэгам
- Третий экран содержит конфигурацию Anki, показывает статус соединения, доступные колоды, управлене типами карточек
- Экран профиля пользователя с именем и аватаром

### Реализация при помощи React Typescript

Проект создан при помощи Vite, в качестве библиотеки компонентов используется Material-UI

### Клиентская маршрутизация

Маршрутизация была реализована при помощи react-router-dom, панель навигации использует компоненты Link для переключения между экранами

### Базовая адаптивность

Базовая адаптивность достигается испольщованием flex и grid css свойств и media правил

2. Базовый бэкенд и работа с базой данных
3. Архитектура фронтенда и динамический интерфейс
4. Аутентификация и авторизация
5. Интеграция frontend и backend

## Backend, api и работа с бд

Инструменты: FastAPI, PostgreSQL, SQLAlchemy, pydantic

Модель данных:
User: id, email (unique), username, password_hash, created_at
Deck: id, owner_id -> User (FK), title, description, is_public, created_at, updated_at
Card: id, deck_id -> Deck (FK, cascade delete), front, back, position, source_text_id -> SourceText (FK, nullable, SET NULL), created_at, updated_at
SourceText: id, owner_id -> User, deck_id -> Deck, raw_text, created_at 

API эндпоитны:
Auth: POST /auth/register, POST /auth/login, GET /users/me
Decks: POST/GET /decks, GET/PATCH/DELETE /decks/{id}, PATCH /decks/{id}/visibility
Cards: POST/GET /decks/{id}/cards, PATCH/DELETE /cards/{id}
Generation: POST /decks/{id}/generate
Public: GET /public/decks, GET /public/decks/{id}
Export: GET /decks/{id}/export/anki 

