import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { brightGreen as hightlight } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import { fetchSagRatings } from "./sag-scraper.ts";
import { parseSagRatings } from "./sagParser.ts";
import { GamePrediction } from "./types/GamePrediction.ts";
import { WeeklySchedule } from "./types/WeeklySchedule.ts";

export interface AutoPickArgs {
  week?: number;
}

async function loadSchedule(): Promise<WeeklySchedule[]> {
  try {
    const json = await Deno.readTextFile("./data/schedule.json");
    const schedule = JSON.parse(json) as WeeklySchedule[];
    console.info(`Loaded Schedule! ${schedule.length} weeks`);
    return schedule;
  } catch (err) {
    console.error(`Unable to load schdule: ${err}`);
    return [];
  }
}

function logPredictions(predictions: GamePrediction[]): void {
  console.log(`PTS AWAY @ HOME SCORE`);
  console.log(`--- ---- @ ---- -----`);

  predictions.forEach((x, idx) => {
    const pts = (predictions.length - idx).toString().padEnd(3, ' ');
    const away = x.away.padEnd(4, ' ');
    const home = x.home.padEnd(4, ' ');
    if (x.predictedWinner === x.home) {
      console.log(`${pts} ${away} @ ${hightlight(home)} ${x.calcScore}`);

    } else {
    console.log(`${pts} ${hightlight(away)} @ ${home} ${x.calcScore}`);

    }
  });

}

async function main(args: AutoPickArgs): Promise<void> {
  const { week } = args;
  if (!week) {
    throw new Error("must supply week agrument");
  }

  // Fetch and parse sagarain ratings
  const sagRatings: string = await fetchSagRatings({ week });
  const ratings = parseSagRatings(sagRatings);
  console.info("Parsed Ratings");
  const ratingsJson = JSON.stringify(ratings);
  const ratingsFileName = `./data/sag-ratings-${week}.json`;
  await Deno.writeTextFile(ratingsFileName, ratingsJson);
  console.info(`Saved Ratings Content: ${ratingsFileName}`);

  // Load schedules
  const schedule = await loadSchedule();
  const weeklySchedule = schedule.find((x) => x.week === week);
  if (!weeklySchedule) {
    throw Error(`Unable to find Week ${week} games in the schedule`);
  }

  // for each game in schedule for week
  const predictions: GamePrediction[] = weeklySchedule.games.filter((x) => x.away !== 'BYE').map((g) => {
    const homeRatings = ratings.teamRatings.find((x) => x.teamName === g.home);
    if (!homeRatings) {
      throw new Error(`unable to find ratings for ${g.home}`);
    }

    const awayRatings = ratings.teamRatings.find((x) => x.teamName === g.away);
    if (!awayRatings) {
      throw new Error(`unable to find ratings for ${g.home}`);
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
  console.info(`Completed predictions`);

  // calculate the winners
  // sort winners
  predictions.sort((a: GamePrediction, b: GamePrediction): number => {
    return (Math.abs(a.calcScore) > Math.abs(b.calcScore)) ? -1 : 1;
  });

  // write winners to file
  const predictionsJson = JSON.stringify(predictions);
  const predictionsFileName = `./data/predictions-${week}.json`;
  await Deno.writeTextFile(predictionsFileName, predictionsJson);
  console.info(`Saved predictions: ${predictionsFileName}`);

  // write winners to console
  logPredictions(predictions);
}

const args = parse(Deno.args, { alias: { "week": "w" } }) as AutoPickArgs;
await main(args);
