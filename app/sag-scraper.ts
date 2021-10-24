import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

function getRatingsContent(html: string): string {
  const $ = cheerio.load(html);
  return $("font:contains('HOME ADVANTAGE')").first().text();
}

async function fetchHtml(verbose?: boolean): Promise<string> {
  const url = "http://sagarin.com/sports/nflsend.htm#Predictions_with_Totals";
  const res = await fetch(url);
  const html = await res.text();
  if (verbose) {
    console.info("Fetched Ratings");
  }
  return html;
}

export async function fetchSagRatings(args: SagScraperArgs): Promise<string> {
  const { week, verbose, log } = args;
  if (!week) {
    throw new Error("must supply week agrument");
  }

  const html = await fetchHtml(verbose);
  const ratingsContent = getRatingsContent(html);
  if (log) {
    const fileName = `./data/sag-ratings-${week}.txt`;
    await Deno.writeTextFile(fileName, ratingsContent);
    if (verbose) console.info(`Saved Ratings Content: ${fileName}`);
  }

  return ratingsContent;
}

export interface SagScraperArgs {
  week?: number;
  verbose?: boolean;
  log?: boolean;
}
