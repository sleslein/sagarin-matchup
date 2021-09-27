import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";

function getRatingsContent(html: string): string {
  const $ = cheerio.load(html);
  return $("font:contains('HOME ADVANTAGE')").first().text();
}

export async function scrape(): Promise<string> {
  const url = "http://sagarin.com/sports/nflsend.htm#Predictions_with_Totals";

  const res = await fetch(url);
  const html = await res.text();

  const ratingsContent = getRatingsContent(html);

  return ratingsContent;
}

export async function scrapeSchedule(): Promise<TeamSchedule[]> {
  const url = "http://www.espn.com/nfl/schedulegrid";

  const res = await fetch(url);
  const html = await res.text();

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

  const ratingsContent = convertHtmlToTeamSchedules(html);

  return ratingsContent;
}

export function convertToWeeklySchedules(
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

export interface TeamSchedule {
  name: string;
  schedule: string[];
}

export interface WeeklySchedule {
  week: number;
  games: Game[];
}

export interface Game {
  home: string;
  away: string;
}
