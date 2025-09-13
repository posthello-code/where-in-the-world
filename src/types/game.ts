export interface Location {
  lat: number;
  lng: number;
  name: string;
  city: string;
  cityVariations?: string[];
  province?: string;
  country: string;
  pointsOfInterest: string[];
}

export interface GuessResult {
  points: number;
  type: 'country' | 'province' | 'city' | 'point of interest' | 'none';
  match: string | null;
}

export interface GuessHistory {
  guess: string;
  result: GuessResult;
  timestamp: number;
}

export type MapStyle = 'street' | 'satellite';

export interface GameState {
  score: number;
  currentZoom: number;
  gameActive: boolean;
  targetLocation: Location | null;
  showLabels: boolean;
  mapStyle: MapStyle;
  guessedItems: {
    country?: string;
    province?: string;
    city?: string;
    pointsOfInterest: string[];
  };
  revealedCategories: {
    country: boolean;
    province: boolean;
    city: boolean;
    pointsOfInterest: boolean;
  };
  guessHistory: GuessHistory[];
}

export type FeedbackType = 'error' | 'wrong' | 'correct' | '';