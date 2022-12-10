import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      gridTemplateColumns: {
        "game-grid": "auto 1fr auto 1fr 1fr",
      },
      gridTemplateRows: {
        layout: "min-content auto min-content",
      },
    },
  },
} as Options;
