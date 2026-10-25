export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface Deck {
  id: number;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  cards: Flashcard[];
}

export interface PublicDeck {
  id: number;
  name: string;
  tags: string[];
  likes: number;
  dislikes: number;
}

export type DeckSettings = Pick<Deck, 'name' | 'description' | 'isPublic'>;
export type FlashcardDraft = Omit<Flashcard, 'id'>;
