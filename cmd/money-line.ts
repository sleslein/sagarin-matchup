import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { main } from "../app/money-line.ts";
import { AutoPickArgs } from "../app/types/AutoPickArgs.ts";

const args = parse(Deno.args, {
  alias: { "week": "w", "verbose": "v", "log": "l" },
}) as AutoPickArgs;

await main(args);
