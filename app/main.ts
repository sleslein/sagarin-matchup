import { teamList } from "../data/teams.ts";
import { convertToWeeklySchedules, scrape, scrapeSchedule, TeamSchedule, WeeklySchedule } from "./sag-scraper.ts";
import { isTeamLine, parseToTeamInfo } from "./sagParser.ts";

const sagRatings: string = await scrape();
await Deno.writeTextFile("testFile.txt", sagRatings);

const schedules: TeamSchedule[] = await scrapeSchedule();
const fullSchedule: WeeklySchedule[] = convertToWeeklySchedules(schedules);

const fullScheduleJson = JSON.stringify(fullSchedule);

await Deno.writeTextFile("schedule.json", fullScheduleJson);

