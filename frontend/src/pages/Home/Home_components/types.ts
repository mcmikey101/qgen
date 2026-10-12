export interface Deck {
  id: number;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  cards: Flashcard[];
  cardCount: number;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}
  
export interface NewDeckValues {
  name: string;
  description: string;
  isPublic: boolean;
  createInAnki: boolean;
  tags: string[];
}
