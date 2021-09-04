import { TeamInfo, TeamRatings, TeamRecord } from "./types/index.ts";

export function isAdvLine(text: string): boolean {
  return text.indexOf("HOME ADVANTAGE=[") > -1;
}

export function isTeamLine(text: string, teamList: string[]): boolean {
  const teamName = parseToTeamName(text);
  return teamList.includes(teamName);
}

export function parseToTeamInfo(line: string): TeamInfo {
  const teamName = line.substring(5, 29).trimEnd();
  const ratings = parseToTeamRatings(line);
  const record = parseToRecord(line);
  const division = parseToDivisionName(line);
  return {
    teamName,
    division,
    ratings,
    record,
  };
}

export function parseToTeamName(line: string): string {
  return line.substring(5, 29).trimEnd();
}

export function parseToDivisionName(line: string): string {
  const end = line.lastIndexOf(")");

  return line.substring(134, end);
}

export function parseToTeamRatings(line: string): TeamRatings {
  const avg = line.substr(32, 5);
  const predictor = line.substr(91, 5);
  const goldenMean = line.substr(106, 5);
  const recent = line.substr(121, 5);

  return {
    avg: parseFloat(avg),
    goldenMean: parseFloat(goldenMean),
    predictor: parseFloat(predictor),
    recent: parseFloat(recent),
  };
}

export function parseToRecord(line: string): TeamRecord {
  return {
    wins: parseInt(line.substr(40, 2)),
    losses: parseInt(line.substr(45, 2)),
    ties: parseInt(line.substr(49, 2)),
  };
}

export const sagParser = {
  isAdvLine,
  isTeamLine,
  parseToTeamName,
  parseToTeamRatings,
};
