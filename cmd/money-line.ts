import { parseArgs } from "@std/cli";
import { main } from "../app/money-line.ts";
import type { AutoPickArgs } from "../app/types/AutoPickArgs.ts";

const args = parseArgs(Deno.args, {
  alias: { week: "w", verbose: "v", log: "l" },
}) as AutoPickArgs;

await main(args);
