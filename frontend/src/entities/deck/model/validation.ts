import { maxLength, required, validate } from '../../../shared/lib/validation';
import type { FlashcardDraft } from './types';

export const DECK_NAME_MAX = 100;
export const DECK_DESCRIPTION_MAX = 500;
export const TAG_MAX = 30;
export const CARD_SIDE_MAX = 1000;

export const validateDeckFields = (values: { name: string; description: string }) => ({
  name: validate(values.name, required('Введите название колоды'), maxLength(DECK_NAME_MAX)),
  description: validate(values.description, maxLength(DECK_DESCRIPTION_MAX)),
});

export const validateCard = (card: FlashcardDraft) => ({
  front: validate(card.front, required('Введите вопрос'), maxLength(CARD_SIDE_MAX)),
  back: validate(card.back, required('Введите ответ'), maxLength(CARD_SIDE_MAX)),
});
