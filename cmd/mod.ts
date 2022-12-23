import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { brightGreen as hightlight } from "https://deno.land/std@0.110.0/fmt/colors.ts";
import { GamePrediction } from "../app/types/GamePrediction.ts";
import { main } from "../app/main.ts";
import { AutoPickArgs } from "../app/types/AutoPickArgs.ts";

async function outputPredictions(predictions: GamePrediction[]): Promise<void> {
  let output = `PTS AWAY @ HOME SCORE
--- ---- @ ---- -----
`;

  predictions.forEach((x, idx) => {
    const pts = (predictions.length - idx).toString().padEnd(3, " ");
    const away = x.away.padEnd(4, " ");
    const home = x.home.padEnd(4, " ");
    if (x.predictedWinner === x.home) {
      output += `${pts} ${away} @ ${hightlight(home)} ${x.calcScore}\n\r`;
    } else {
      output += `${pts} ${hightlight(away)} @ ${home} ${x.calcScore}\n\r`;
          }
  });
  await Deno.stdout.write(new TextEncoder().encode(output));
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
      await Deno.stdout.write(new TextEncoder().encode(`Saved predictions: ${predictionsFileName}`));
    }
  }

  // write winners to stdout
  await outputPredictions(predictions);
  Deno.exit(0);
} catch (error) {
  const { message } = error as Error;
  await Deno.stderr.write(new TextEncoder().encode(message));
  Deno.exit(1);
}
