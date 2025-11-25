export interface FortuneResult {
  signLevel: string; // e.g., 上上签, 中吉
  title: string;     // e.g., 姜太公钓鱼
  poem: string[];    // Array of strings for the poem lines (Traditional)
  explanation: string; // Simplified Chinese interpretation
  luckyNumbers?: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SHAKING = 'SHAKING',
  DROPPING = 'DROPPING', // Stick falling animation
  RESULT = 'RESULT',     // Showing the result
}

// Visual types
export interface StickProps {
  className?: string;
  isWinning?: boolean;
}
