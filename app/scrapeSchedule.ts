import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import { Game, TeamSchedule, WeeklySchedule } from "./types/index.ts";

async function fetchHtml(): Promise<string> {
  const url = "http://www.espn.com/nfl/schedulegrid";
  const res = await fetch(url);
  const html = await res.text();
  return html;
}

function convertHtmlToTeamSchedules(html: string): TeamSchedule[] {
  const $ = cheerio.load(html);
  const teamRows = $(".tablehead tr").not(".stathead").not(".colhead");
  let schedulesArr: TeamSchedule[] = [];

  // Loop over each row to bulid an array teach schedules
  teamRows.each((_colIndex, tr) => {
    //console.log($(tr).html());
    const teamSch: TeamSchedule = { name: "", schedule: [] };
    $(tr).children("td").each((_colIdx, weekCell) => {
      // console.log($(weekCell).html());
      const val = $(weekCell).text();
      if (_colIdx === 0) {
        teamSch.name = val;
      } else {
        teamSch.schedule = [...teamSch.schedule, val];
      }
    });
    schedulesArr = [...schedulesArr, teamSch];
  });
  console.log(schedulesArr);
  return schedulesArr;
}

function convertToWeeklySchedules(
  teamSchedules: TeamSchedule[],
): WeeklySchedule[] {
  const weeklySchedules: WeeklySchedule[] = [];

  teamSchedules.forEach((teamSch: TeamSchedule) => {
    teamSch.schedule.forEach((opponent: string, weekIdx: number) => {
      const week = weekIdx + 1;
      let sch = weeklySchedules.find((x) => x.week === week);

      if (!sch) {
        sch = { week, games: [] };
        weeklySchedules.push(sch);
      }

      const teamIsHome = !opponent.startsWith("@");
      const game: Game = teamIsHome
        ? { home: teamSch.name, away: opponent }
        : { home: opponent.replace("@", ""), away: teamSch.name };

      if (
        !sch.games.some((x) => x.away === game.away && x.home === game.home)
      ) {
        sch.games.push(game);
      }
    });
  });

  return weeklySchedules;
}

async function main() {
  const html = await fetchHtml();
  const schedules: TeamSchedule[] = convertHtmlToTeamSchedules(html);
  const fullSchedule: WeeklySchedule[] = convertToWeeklySchedules(schedules);

  const fullScheduleJson = JSON.stringify(fullSchedule);

  await Deno.writeTextFile("./data/schedule.json", fullScheduleJson);
}

await main();
