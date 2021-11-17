import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { sagParser } from "../sagParser.ts";
import { teamList } from "../../data/teams.ts";
import { SagarinRating, TeamRecord } from "../types/index.ts";

const teamLineText =
  "   2  Tampa Bay Buccaneers    =  26.15   15   4   1    0.00(   0)   0  0  0 |   0  0  0 |   26.15    2 |   26.15    2 |   26.15    2  (NFC SOUTH)";

const homeAdvLineText =
  "                HOME ADVANTAGE=[  2.49]                                                   [  2.49]       [  2.49]       [  2.49]";

const weekLine = "NFL 2021 through games of 2021 October 18 Monday - Week 6";

Deno.test("isWeekLine", () => {
  const result = sagParser.isWeekLine(weekLine);
  assert(result === true);
});

Deno.test("parseWeekLine", () => {
  const result = sagParser.parseWeekLine(weekLine);
  console.log("result! - " + result);
  assert(result === 6);
});

Deno.test("isAdvLine", () => {
  const result = sagParser.isAdvLine(homeAdvLineText);
  assert(result === true);
});

Deno.test("isTeamLine", () => {
  const result = sagParser.isTeamLine(teamLineText, teamList);
  assert(result === true);
});

Deno.test("parseTeamName", () => {
  const result = sagParser.parseToTeamName(teamLineText);
  assertEquals(result, "Tampa Bay Buccaneers");
});

Deno.test("parseToRatings can parse team ratings", () => {
  const result = sagParser.parseToRatings(teamLineText);
  const expected: SagarinRating = {
    avg: 26.15,
    goldenMean: 26.15,
    predictor: 26.15,
    recent: 26.15,
  };

  assertEquals(result, expected);
});

Deno.test("parseToRatings can parse home advantace ratings", () => {
  const result = sagParser.parseToRatings(homeAdvLineText);
  const expected: SagarinRating = {
    avg: 2.49,
    goldenMean: 2.49,
    predictor: 2.49,
    recent: 2.49,
  };

  assertEquals(result, expected);
});

Deno.test("parseToTeamRecord", () => {
  const result = sagParser.parseToTeamRecord(teamLineText);
  const expected: TeamRecord = {
    wins: 15,
    losses: 4,
    ties: 1,
  };

  assertEquals(result, expected);
});

Deno.test("parseToDivisionName", () => {
  const result = sagParser.parseToDivisionName(teamLineText);
  const expected = "NFC SOUTH";

  assertEquals(result, expected);
});

Deno.test("parseSagRatings given valid file returns homeAdvantage and 32 teams", async () => {
  const fileContents = await Deno.readTextFile("./mock/ratings.txt");
  const result = sagParser.parseSagRatings(fileContents);
  const expectedHomeAdv: SagarinRating = {
    avg: .36,
    goldenMean: .38,
    predictor: .36,
    recent: .36,
  };

  assertEquals(result.week, 6);
  assertEquals(result.homeAdvantage, expectedHomeAdv);
  assertEquals(result.teamRatings.length, 32);
});
