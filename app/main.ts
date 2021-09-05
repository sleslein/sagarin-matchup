import { teamList } from "../data/teams.ts";
import { scrape } from "./sag-scraper.ts";
import { isTeamLine, parseToTeamInfo } from "./sagParser.ts";

const sagRatings: string = await scrape();
const withoutTabs = sagRatings.replaceAll("/t", "");

console.log(withoutTabs);
await Deno.writeTextFile("testFile.txt", sagRatings);
