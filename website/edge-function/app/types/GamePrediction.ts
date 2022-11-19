import { Game } from "./Game.ts";
import { SagarinRating } from "./TeamRatings.ts";

export interface GamePrediction extends Game {
  homeRatings: SagarinRating;
  awayRatings: SagarinRating;
  predictedWinner: string;
  calcScore: number;
}
