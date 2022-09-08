# Overview

This app pulls html data for football teams and uses it to predict which team
will win.

## Quick Start

### Updating the Schedule

A schedule file must exist before fetching ratings.  To get a schedule file run the following command:

```sh
deno run --allow-net --allow-write app/scrapeSchedule.ts
```

### Getting Weekly Matchups

Assuming you've installed [Deno](https://deno.land/#installation) already, you can the following command to run generate the picks.

```sh
deno run --allow-net --allow-read app/main.ts -w 11
```

## Todos

- [x] Update Readme
- [ ] Build web interface
- [ ] Document CLI interface

## CLI interface
