import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";

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
  const { verbose } = args;

  const html = await fetchHtml(verbose);
  const ratingsContent = getRatingsContent(html);
  if (verbose) {
    console.info("Trimmed Ratings");
  }
  return ratingsContent;
}

export interface SagScraperArgs {
  week?: number;
  verbose?: boolean;
  log?: boolean;
}
