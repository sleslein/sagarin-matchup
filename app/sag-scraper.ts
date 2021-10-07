import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";

function getRatingsContent(html: string): string {
  const $ = cheerio.load(html);
  return $("font:contains('HOME ADVANTAGE')").first().text();
}

async function fetchHtml(): Promise<string> {
  const url = "http://sagarin.com/sports/nflsend.htm#Predictions_with_Totals";
  const res = await fetch(url);
  const html = await res.text();
  console.info("Fetched Ratings");
  return html;
}

export async function fetchSagRatings(args: SagScraperArgs): Promise<string> {
  const { week } = args;
  if (!week) {
    throw new Error("must supply week agrument");
  }

  const html = await fetchHtml();
  const ratingsContent = getRatingsContent(html);
  const fileName = `./data/sag-ratings-${week}.txt`;

  await Deno.writeTextFile(fileName, ratingsContent);
  console.info(`Saved Ratings Content: ${fileName}`);

  return ratingsContent;
}

await fetchSagRatings(
  parse(Deno.args, { alias: { "week": "w" } }) as SagScraperArgs,
);

export interface SagScraperArgs {
  week?: number;
}
