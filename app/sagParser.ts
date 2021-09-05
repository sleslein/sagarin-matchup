import { teamList } from "../data/teams.ts";
import { SagarinRating, TeamInfo, TeamRecord } from "./types/index.ts";
import { WeeklyRatings } from "./types/SagarinRatings.ts";

export function isAdvLine(text: string): boolean {
  return text.indexOf("HOME ADVANTAGE=[") > -1;
}

export function isTeamLine(text: string, teamList: string[]): boolean {
  const teamName = parseToTeamName(text);
  return teamList.includes(teamName);
}

export function parseToTeamInfo(line: string): TeamInfo {
  const teamName = parseToTeamName(line);
  const ratings = parseToRatings(line);
  const record = parseToTeamRecord(line);
  const division = parseToDivisionName(line);
  return {
    teamName,
    division,
    ratings,
    record,
  };
}

export function parseToTeamName(line: string): string {
  return line.substring(6, 29).trimEnd();
}

export function parseToDivisionName(line: string): string {
  const end = line.lastIndexOf(")");

  return line.substring(135, end);
}

export function parseToRatings(line: string): SagarinRating {
  const avg = line.substr(33, 5);
  const predictor = line.substr(92, 5);
  const goldenMean = line.substr(107, 5);
  const recent = line.substr(122, 5);

  return {
    avg: parseFloat(avg),
    goldenMean: parseFloat(goldenMean),
    predictor: parseFloat(predictor),
    recent: parseFloat(recent),
  };
}

export function parseToHomeAdvRatings(line: string): SagarinRating {
  // line = line.replaceAll('/t','');
  const avg = line.substr(33, 5);
  const predictor = line.substr(92, 5);
  const goldenMean = line.substr(107, 5);
  const recent = line.substr(122, 5);

  return {
    avg: parseFloat(avg),
    goldenMean: parseFloat(goldenMean),
    predictor: parseFloat(predictor),
    recent: parseFloat(recent),
  };
}

export function parseToTeamRecord(line: string): TeamRecord {
  return {
    wins: parseInt(line.substr(41, 2)),
    losses: parseInt(line.substr(46, 2)),
    ties: parseInt(line.substr(50, 2)),
  };
}

export function parseSagRatings(text: string): WeeklyRatings {
  const records: string[] = text.split("\n");
  const result: WeeklyRatings = {
    homeAdvantage: { predictor: 0, avg: 0, recent: 0, goldenMean: 0 },
    teamRatings: [],
  };

  records.forEach((r) => {
    if (isAdvLine(r)) {
      result.homeAdvantage = parseToRatings(r);
      return;
    }
    if (isTeamLine(r, teamList)) {
      const teamInfo = parseToTeamInfo(r);
      result.teamRatings = [...result.teamRatings, teamInfo];
      return;
    }
  });

  return result;
}

export const sagParser = {
  isAdvLine,
  isTeamLine,
  parseToTeamName,
  parseToTeamInfo,
  parseToTeamRecord,
  parseToRatings,
  parseSagRatings,
  parseToDivisionName,
};
