import { fetchSagRatings } from "./sag-scraper.ts";
import { parseSagRatings } from "./sagParser.ts";
import { AutoPickArgs } from "./types/AutoPickArgs.ts"
import { GamePrediction } from "./types/GamePrediction.ts";
import { WeeklyRatings } from "./types/SagarinRatings.ts";
import { WeeklySchedule } from "./types/WeeklySchedule.ts";


async function loadSchedule(verbose?: boolean): Promise<WeeklySchedule[]> {
  try {
    // const json = await Deno.readTextFile("../data/schedule.json");
    // const schedule = JSON.parse(json) as WeeklySchedule[];
    //const json = await fetch("http://localhost:8888/data/schedule.json");
    const response = await fetch(new URL("../data/schedule.json", import.meta.url));
    const schedule = await response.json() as WeeklySchedule[];

    if (verbose) {
      console.info(`Loaded Schedule! ${schedule.length} weeks`);
    }
    return schedule;
  } catch (err) {
    console.error(`Unable to load schdule: ${err}`);
    return [];
  }
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

export async function main(args: AutoPickArgs): Promise<GamePrediction[]> {
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
    const ratingsFileName = `../data/sag-ratings-${week}.json`;
    
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
