import type { Deck } from './types';

export const fakeDecks: Deck[] = [
  {
    id: 1,
    name: 'Основы биологии',
    description: 'Базовые понятия клеточной биологии и ботаники.',
    tags: ['Наука', 'Биология'],
    isPublic: false,
    cardCount: 2,
    cards: [
      { id: 1, front: 'Что является основной единицей живого организма?', back: 'Клетка.' },
      { id: 2, front: 'Где происходит фотосинтез?', back: 'Преимущественно в хлоропластах.' },
    ],
  },
  {
    id: 2,
    name: 'Японские слова',
    description: 'Слова для повторения.',
    tags: ['Японский'],
    isPublic: true,
    cardCount: 0,
    cards: [],
  },
  {
    id: 3,
    name: 'JavaScript',
    description: 'Основы языка.',
    tags: ['Программирование'],
    isPublic: false,
    cardCount: 0,
    cards: [],
  },
];
