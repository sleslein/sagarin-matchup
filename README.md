# Overview

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

This app pulls html data for football teams from the Sagarin NFL Ratings and
uses it to predict which team will win for any given week.

## Quick Start

### Updating the Schedule

A schedule file must exist before fetching ratings. To get a schedule file run
the following command:

```sh
cd cmd
deno run --allow-net --allow-write app/scrapeSchedule.ts
```

### Getting Weekly Matchups

Assuming you've installed [Deno](https://deno.land/#installation) already, you
can the following command to run generate the picks.

```sh
cd cmd
deno run --allow-net --allow-read mod.ts -w 11
```

#### Logging results to file

The results can also be written to a file with the `-l` and/or `-v` flags. When
doing so, also pass the `--allow-write` flag into deno. The `-v` flag will write
the filename and location to the console.

```sh
cd cmd
deno run --allow-net --allow-read --allow-write app/main.ts -w 11 -l -v
```

### Running the web application

The web application can be run locally with the following command:

```
cd fresh-web
deno task start
```

## Attribution

Favicon provided by Squid Ink at
[Icon Archive](https://iconarchive.com/show/free-flat-sample-icons-by-thesquid.ink/football-icon.html)
