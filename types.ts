
export interface Player {
  id: string;
  name: string;
  avatar: string; // Emoji
  color: string;
}

export interface GameRecord {
  gameId: string;
  score: number;
  date: number;
}

export type GameId = 
  | 'snake' 
  | 'memory' 
  | 'math' 
  | 'reflex' 
  | 'simon' 
  | 'whack' 
  | 'trivia' 
  | 'clicker'
  | 'breathing'
  | 'color_match'
  | 'tictactoe'
  | 'rps'
  | 'typing'
  | 'guess'
  | 'odd_one'
  | 'gol_pooch'
  | 'yalda'
  | 'flags'
  | 'capitals'
  | 'soccer'
  | 'maze'
  | 'racer'
  | 'ninja'
  | 'duel'
  | 'sumo'
  | 'tap_war'
  | 'locked';

export interface GameMeta {
  id: GameId;
  name: string;
  description: string;
  image: string; // URL for the background image
  icon: any; // Lucide Icon
  color: string;
  bgColor: string; // Fallback or overlay color
  difficulty: 'Easy' | 'Medium' | 'Hard' | '2-Player' | '4-Player';
}