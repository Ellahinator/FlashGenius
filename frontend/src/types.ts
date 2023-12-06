export interface DeckFlashcard {
  term: string;
  definition: string;
  flashcard_id: number;
}

export interface Deck {
  deck_id: string;
  deck_name: string;
  term_count: number;
}
