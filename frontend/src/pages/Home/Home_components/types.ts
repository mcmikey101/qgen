export interface Deck {
    id: number;
    name: string;
    tags: string[];
    cardCount: number;
  }
  
export interface NewDeckValues {
  name: string;
  description: string;
  file: File | null;
  isPublic: boolean;
  createInAnki: boolean;
  tags: string[];
}