import { assert, assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { isAdvLine, isTeamLine, parseToDivisionName, parseToRecord, parseToTeamName, parseToTeamRatings } from "../sagParser.ts";
import { teamList } from '../../data/teams.ts';
import { TeamRatings, TeamRecord } from "../types/index.ts";

const teamLineText = '  1  Tampa Bay Buccaneers    =  28.30   15   5   0   21.23(   6)   4  4  0 |   5  4  0 |   28.03    1 |   27.44    2 |   30.82    1  (NFC SOUTH)';
 
Deno.test('isAdvLine', () => {
    const lineContent ='                HOME ADVANTAGE=[  0.36]                                                   [  0.36]       [  0.38]       [  0.36]';
    const result = isAdvLine(lineContent);
    assert(result === true);
});

Deno.test('isTeamLine', () => {
    const result = isTeamLine(teamLineText, teamList);
    assert(result === true);
});

Deno.test('parseTeamName', () => {
    const result = parseToTeamName(teamLineText);
    assert(result === 'Tampa Bay Buccaneers');
});

Deno.test('parseToTeamRatings', () => {
    const result = parseToTeamRatings(teamLineText);
    const expected: TeamRatings = {
        avg: 28.3,
        goldenMean: 27.44,
        predictor: 28.03,
        recent: 30.82
    }
    
    assertEquals(result, expected);
});

Deno.test('parseToRecord', () => {
    const result = parseToRecord(teamLineText);
    const expected: TeamRecord = {
        wins: 15,
        losses: 5,
        ties: 0
    }
    
    assertEquals(result, expected);
});

Deno.test('parseToDivisionName', () => {
    const result = parseToDivisionName(teamLineText);
    const expected = 'NFC SOUTH';
    
    assertEquals(result, expected);
});
