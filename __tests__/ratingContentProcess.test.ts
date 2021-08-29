import { assert } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { isAdvLine, isTeamLine } from "../ratingContentProcessor.ts";

Deno.test('isAdvLine', () => {
    const lineContent ='                HOME ADVANTAGE=[  0.36]                                                   [  0.36]       [  0.38]       [  0.36]';
    const result = isAdvLine(lineContent);
    assert(result === true);
});

Deno.test('isTeamLine', () => {
    const lineContent = '  1  Tampa Bay Buccaneers    =  28.30   15   5   0   21.23(   6)   4  4  0 |   5  4  0 |   28.03    1 |   27.44    2 |   30.82    1  (NFC SOUTH)';
    const result = isTeamLine(lineContent);
    assert(result === true);
});