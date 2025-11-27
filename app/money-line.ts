/** */

import { loadSync } from "@std/dotenv";
import { magenta as highlight } from "@std/fmt/colors";
import type { AutoPickArgs } from "./types/AutoPickArgs.ts";

function buildUrl(week: number) {
  const weekVal = weekLookup.get(week);

  if (!weekVal) {
    throw new Error(`week ${week} does not exist in the lookup`);
  }

  const { to, from } = weekVal;
  const baseUrl = "https://api.the-odds-api.com";
  const _ = loadSync({ envPath: `../.env`, export: true });
  const apiKey = Deno.env.get("ODDS_API_KEY");
  return `${baseUrl}/v4/sports/americanfootball_nfl/odds?regions=us&oddsFormat=american&apiKey=${apiKey}&commenceTimeFrom=${from}&commenceTimeTo=${to}`;
}

type MoneyLineOutcome = {
  name: string;
  price: number;
};

type Market = {
  key: string;
  last_update: string;
  outcomes: MoneyLineOutcome[];
};

type Bookmaker = {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
};

type OddsEntry = {
  id: string;
  sports_key: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
};
type GetOddsResponse = Array<OddsEntry>;

const weekLookup = new Map<number, { to: string; from: string }>([
  [1, { from: "2025-09-04T00:00:00Z", to: "2025-09-10T23:59:59Z" }],
  [2, { from: "2025-09-11T00:00:00Z", to: "2025-09-17T23:59:59Z" }],
  [3, { from: "2025-09-18T00:00:00Z", to: "2025-09-24T23:59:59Z" }],
  [4, { from: "2025-09-22T00:00:00Z", to: "2025-10-01T23:59:59Z" }],
  [5, { from: "2025-10-02T00:00:00Z", to: "2025-10-08T23:59:59Z" }],
  [6, { from: "2025-10-09T00:00:00Z", to: "2025-10-15T23:59:59Z" }],
  [7, { from: "2025-10-16T00:00:00Z", to: "2025-10-22T23:59:59Z" }],
  [8, { from: "2025-10-23T00:00:00Z", to: "2025-10-29T23:59:59Z" }],
  [9, { from: "2025-10-30T00:00:00Z", to: "2025-11-05T23:59:59Z" }],
  [10, { from: "2025-11-06T00:00:00Z", to: "2025-11-12T23:59:59Z" }],
  [11, { from: "2025-11-13T00:00:00Z", to: "2025-11-19T23:59:59Z" }],
  [12, { from: "2025-11-20T00:00:00Z", to: "2025-11-26T23:59:59Z" }],
  [13, { from: "2025-11-27T00:00:00Z", to: "2025-12-03T23:59:59Z" }],
  [14, { from: "2025-12-04T00:00:00Z", to: "2025-12-10T23:59:59Z" }],
  [15, { from: "2025-12-11T00:00:00Z", to: "2025-12-17T23:59:59Z" }],
  [16, { from: "2025-12-18T00:00:00Z", to: "2025-12-24T23:59:59Z" }],
  [17, { from: "2025-12-25T00:00:00Z", to: "2025-12-31T23:59:59Z" }],
  [18, { from: "2026-01-01T00:00:00Z", to: "2026-01-07T23:59:59Z" }],
]);

type MoneyLineGame = {
  home: string;
  homeLine: number;
  away: string;
  awayLine: number;
};

function reduceToGame(accumulator: MoneyLineGame[], oddsEntry: OddsEntry) {
  const draftKingsLine = oddsEntry.bookmakers.find((bm) => {
    return bm.key === "draftkings";
  });
  const moneyLineMarket = draftKingsLine?.markets.find((m) => {
    return m.key === "h2h";
  });

  const game = {
    home: oddsEntry.home_team,
    homeLine:
      moneyLineMarket?.outcomes.find((outcome) => {
        return outcome.name === oddsEntry.home_team;
      })?.price ?? 0,
    away: oddsEntry.away_team,
    awayLine:
      moneyLineMarket?.outcomes.find((outcome) => {
        return outcome.name === oddsEntry.away_team;
      })?.price ?? 0,
  };

  return [...accumulator, game];
}

function writeGameOutput(lines: MoneyLineGame[]) {
  const out = lines
    .map((line) => {
      return line.awayLine < 0
        ? `(${highlight(line.awayLine.toString())}) ${highlight(
            line.away,
          )} @ ${line.homeLine}: ${line.home}`
        : `(${line.awayLine}) ${line.away} @ ${highlight(
            line.homeLine.toString(),
          )}: ${highlight(line.home)}`;
    })
    .join("\n");

  Deno.stdout.write(new TextEncoder().encode(out));
}

export async function main(args: AutoPickArgs) {
  const { week = 8 } = args;
  const url = buildUrl(week);
  try {
    console.log(`url: ${url}`);
    const results = await fetch(url);
    console.log(JSON.stringify(results));
    const data: GetOddsResponse = await results.json();
    // const data:OddsEntry[]  = await JSON.parse(week8Results);

    // const moneyLineOutcomes = data.reduce(reduceGame, []);
    const moneyLineOutcomes = data.reduce(reduceToGame, []);
    // const sortedMoneyLine = moneyLineOutcomes.sort((a, b) => {
    //   return a.price > b.price ? 1 : -1;
    // });
    const sortedMoneyLine = moneyLineOutcomes.sort((a, b) => {
      const aBestLine = a.awayLine < a.homeLine ? a.awayLine : a.homeLine;
      const bBestLine = b.awayLine < b.homeLine ? b.awayLine : b.homeLine;
      return aBestLine < bBestLine ? -1 : 1;
    });

    // writeOutput(sortedMoneyLine);
    writeGameOutput(sortedMoneyLine);
    Deno.exit(0);
  } catch (ex) {
    JSON.stringify(ex);
    Deno.exit(1);
  }
}
