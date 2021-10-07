import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { fetchSagRatings } from "./sag-scraper.ts";
import { parseSagRatings } from "./sagParser.ts";

export interface AutoPickArgs {
  week?: number;
}

async function main(args: AutoPickArgs): Promise<void> {
  const { week } = args;
  const sagRatings: string = await fetchSagRatings({ week });
  const ratings = parseSagRatings(sagRatings);
  console.info("Parsed Ratings");
  const ratingsJson = JSON.stringify(ratings);
  const ratingsFileName = `./data/sag-ratings-${week}.json`;
  await Deno.writeTextFile(ratingsFileName, ratingsJson);
  console.info(`Saved Ratings Content: ${ratingsFileName}`);
}

const args = parse(Deno.args, { alias: { "week": "w" } }) as AutoPickArgs;
await main(args);
