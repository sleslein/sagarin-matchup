import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { brightGreen as hightlight } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import { fetchSagRatings } from "./sag-scraper.ts";
import { parseSagRatings } from "./sagParser.ts";
import { GamePrediction } from "./types/GamePrediction.ts";
import { WeeklyRatings } from "./types/SagarinRatings.ts";
import { WeeklySchedule } from "./types/WeeklySchedule.ts";

export interface AutoPickArgs {
  week?: number;
  verbose?: boolean;
  log?: boolean;
}

async function loadSchedule(verbose?: boolean): Promise<WeeklySchedule[]> {
  try {
    const json = await Deno.readTextFile("./data/schedule.json");
    const schedule = JSON.parse(json) as WeeklySchedule[];
    if (verbose) {
      console.info(`Loaded Schedule! ${schedule.length} weeks`);
    }
    return schedule;
  } catch (err) {
    console.error(`Unable to load schdule: ${err}`);
    return [];
  }
}

function outputPredictions(predictions: GamePrediction[]): void {
  console.log(`PTS AWAY @ HOME SCORE`);
  console.log(`--- ---- @ ---- -----`);

  predictions.forEach((x, idx) => {
    const pts = (predictions.length - idx).toString().padEnd(3, " ");
    const away = x.away.padEnd(4, " ");
    const home = x.home.padEnd(4, " ");
    if (x.predictedWinner === x.home) {
      console.log(`${pts} ${away} @ ${hightlight(home)} ${x.calcScore}`);
    } else {
      console.log(`${pts} ${hightlight(away)} @ ${home} ${x.calcScore}`);
    }
  });
}

function createPredictions(
  weeklySchedule: WeeklySchedule,
  ratings: WeeklyRatings,
): GamePrediction[] {
  const predictions: GamePrediction[] = weeklySchedule.games.filter((x) =>
    x.away !== "BYE"
  ).map((g) => {
    const homeRatings = ratings.teamRatings.find((x) => x.teamName === g.home);
    if (!homeRatings) {
      throw new Error(`unable to find ratings for ${g.home}`);
    }

    const awayRatings = ratings.teamRatings.find((x) => x.teamName === g.away);
    if (!awayRatings) {
      throw new Error(`unable to find ratings for ${g.away}`);
    }

    const calcScore = (homeRatings?.ratings.avg + ratings.homeAdvantage.avg) -
      awayRatings?.ratings.avg;

    const result: GamePrediction = {
      ...g,
      homeRatings: homeRatings.ratings,
      awayRatings: awayRatings.ratings,
      calcScore,
      predictedWinner: calcScore >= 0 ? g.home : g.away,
    };

    return result;
  });
  predictions.sort((a: GamePrediction, b: GamePrediction): number => {
    return (Math.abs(a.calcScore) > Math.abs(b.calcScore)) ? -1 : 1;
  });
  return predictions;
}

async function main(args: AutoPickArgs): Promise<GamePrediction[]> {
  const { week, verbose, log } = args;
  if (!week) {
    throw new Error("must supply week agrument");
  }

  // Fetch and parse sagarain ratings
  const sagRatings: string = await fetchSagRatings({ week, verbose, log });
  if (log) {
    const fileName = `./data/sag-ratings-${week}.txt`;
    await Deno.writeTextFile(fileName, sagRatings);
    if (verbose) console.info(`Saved Ratings Content: ${fileName}`);
  }

  const ratings = parseSagRatings(sagRatings);

  if (verbose) {
    console.info("Parsed Ratings");
  }

  if (log) {
    const ratingsJson = JSON.stringify(ratings);
    const ratingsFileName = `./data/sag-ratings-${week}.json`;
    await Deno.writeTextFile(ratingsFileName, ratingsJson);
    console.info(`Saved Ratings Content: ${ratingsFileName}`);
  }

  // Load schedules
  const schedule = await loadSchedule();
  const weeklySchedule = schedule.find((x) => x.week === week);
  if (!weeklySchedule) {
    throw Error(`Unable to find Week ${week} games in the schedule`);
  }

  const predictions = createPredictions(weeklySchedule, ratings);

  return predictions;
}

try {
  const args = parse(Deno.args, {
    alias: { "week": "w", "verbose": "v", "log": "l" },
  }) as AutoPickArgs;
  const predictions = await main(args);

  // write winners to file
  if (args.log) {
    const predictionsJson = JSON.stringify(predictions);
    const predictionsFileName = `./data/predictions-${args.week}.json`;
    await Deno.writeTextFile(predictionsFileName, predictionsJson);

    if (args.verbose) {
      console.info(`Saved predictions: ${predictionsFileName}`);
    }
  }

  // write winners to console
  outputPredictions(predictions);
} catch (error) {
  const { message } = error as Error;
  console.log(message);
}
