import { demoRequest } from '../../../shared/api/demoRequest';
import type { Deck, PublicDeck } from '../model/types';

const demoDecks: Deck[] = [
  {
    id: 1,
    name: 'Основы биологии',
    description: 'Базовые понятия клеточной биологии и ботаники.',
    tags: ['Наука', 'Биология'],
    isPublic: false,
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
    cards: [],
  },
  {
    id: 3,
    name: 'JavaScript',
    description: 'Основы языка.',
    tags: ['Программирование'],
    isPublic: false,
    cards: [],
  },
];

const demoPublicDecks: PublicDeck[] = [
  { id: 1, name: 'World History', tags: ['History', 'Geography'], likes: 120, dislikes: 4 },
  { id: 2, name: 'Spanish Vocab', tags: ['Spanish', 'Language'], likes: 85, dislikes: 2 },
  { id: 3, name: 'React Hooks', tags: ['Programming', 'React'], likes: 200, dislikes: 10 },
  { id: 4, name: 'Chemistry Elements', tags: ['Science', 'Chemistry'], likes: 60, dislikes: 1 },
];

export const fetchMyDecks = () => demoRequest(demoDecks);
export const fetchPublicDecks = () => demoRequest(demoPublicDecks);
