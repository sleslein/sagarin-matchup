import { Game } from "./Game.ts";

export interface WeeklySchedule {
  week: number;
  games: Game[];
}
