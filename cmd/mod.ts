import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { brightGreen as hightlight } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import { GamePrediction } from "../app/types/GamePrediction.ts";
import { main } from "../app/main.ts";

function outputPredictions(predictions: GamePrediction[]): void {
  console.log(`PTS AWAY @ HOME SCORE`);
  console.log(`--- ---- @ ---- -----`);

  predictions.forEach((x, idx) => {
    const pts = (predictions.length - idx).toString().padEnd(3, " ");
    const away = x.away.padEnd(4, " ");
    const home = x.home.padEnd(4, " ");
    if (x.predictedWinner === x.home) {
      console.log(`${pts} ${away} @ ${hightlight(home)} ${x.calcScore}`);
    } else {
      console.log(`${pts} ${hightlight(away)} @ ${home} ${x.calcScore}`);
    }
  });
}

try {
  const args = parse(Deno.args, {
    alias: { "week": "w", "verbose": "v", "log": "l" },
  }) as AutoPickArgs;
  const predictions = await main(args);

  // write winners to file
  if (args.log) {
    const predictionsJson = JSON.stringify(predictions);
    const predictionsFileName = `./data/predictions-${args.week}.json`;
    await Deno.writeTextFile(predictionsFileName, predictionsJson);

    if (args.verbose) {
      console.info(`Saved predictions: ${predictionsFileName}`);
    }
  }

  // write winners to console
  outputPredictions(predictions);
} catch (error) {
  const { message } = error as Error;
  console.log(message);
}
