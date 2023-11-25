export interface DeckFlashcard {
  term: string;
  definition: string;
}

export interface Deck {
  deck_id: string;
  deck_name: string;
  term_count: number;
}
