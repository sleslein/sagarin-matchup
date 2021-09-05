import { TeamInfo } from "./TeamInfo.ts";
import { SagarinRating } from "./TeamRatings.ts";

export interface WeeklyRatings {
  teamRatings: TeamInfo[];
  homeAdvantage: HomeAdvantage;
}

export type HomeAdvantage = SagarinRating;
