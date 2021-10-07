# Overview

This app pulls html data for football teams and uses it to predict which team
will win.

## Todos

- [ ] Logic Related
  - [x] Sag Scraper
  - [x] Sag Parser
    - [x] Parse home advantage
    - [x] Parse team data
  - [ ] compose app
  - [ ] Add command to predict week
  - [ ] Write results to file

- [ ] Data Related
  - [x] Complete `teamsList.ts`
  - [x] Pull weekly schedule from web

## CLI interface'

- scrape-schedule scrapes schedule and saved schedule.json

- scrape-sag inputs -w Week number scrapes sag sch and saves to json names file
  based on week number

- gen-picks -w Week Number scrapes sag ratings and generates pics based on sag
  ratings Saves results to file and console
