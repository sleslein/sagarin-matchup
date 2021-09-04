import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
const url = "http://sagarin.com/sports/nflsend.htm#Predictions_with_Totals";

const res = await fetch(url);
const html = await res.text();

const ratingsContent = getRatingsContent(html);
console.log(ratingsContent);

function getRatingsContent(html: string): string {
  const $ = cheerio.load(html);
  return $("font:contains('HOME ADVANTAGE')").first().text();
}

console.log("done");
