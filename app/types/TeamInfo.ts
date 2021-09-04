import { TeamRatings } from "./TeamRatings.ts";
import { TeamRecord } from "./TeamRecord.ts";

export interface TeamInfo {
  teamName: string;
  division: string;
  record: TeamRecord;
  ratings: TeamRatings;
}
