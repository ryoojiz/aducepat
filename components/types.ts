export interface Answer {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  type: 'text' | 'image' | 'video';
}

export interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  type: 'text' | 'image' | 'video';
  answer: Answer;
}

export interface Participant {
  id: number;
  name: string;
  score: number;
}

export type GameState = 'waiting' | 'selected' | 'correct' | 'incorrect';