---
date: 2026-10-07
title: "Maintenance was paused. Maintenance came back."
category: github
actor: github
tool: github
source_url: https://www.githubstatus.com/incidents/djlmxz2zd0j7
source_date: 2026-10-07
status: "paused maintenance. Maintenance ignored the pause."
detail:
  - "A replacement machine came online with an old list of database servers, some already retired, and sent writes to servers that no longer existed."
  - "GitHub paused automated maintenance. At 16:52 an automated maintenance task that did not honour the pause put the same machine back in charge."
  - "Up to 26% of Git authentication requests failed. A Puppet update had broken the pause; the automation now honours it."
story_alt: "DEV presses a big yellow pause button that lowers a striped barrier, while a CRT robot in a hard hat ducks under it with a wrench and heads for a row of servers that are already sparking."
summary: "GitHub paused automated maintenance after a bad machine broke Git writes, then a maintenance task that ignored the pause put the same machine back in charge."
facts:
  who: "GitHub's own automated maintenance on the service that routes database writes"
  broke: "Writes went to retired servers twice and up to 26% of Git authentication requests failed"
  saved: "Nothing needed saving: no data was lost"
  fix: "The automation now honours the pause, which a Puppet update had broken"
invented: "The server names DB 4 and DB 7, both robots' lines, DEV's failed push and its error text, the bin and the closing tease."
---
## What happened

GitHub keeps an internal service that tracks which database servers should receive writes. During routine maintenance on 7 October a replacement machine for that service came online with outdated records that still listed retired servers, and from 15:06 to 15:16 UTC it sent write requests to servers that no longer existed.

GitHub found the machine and paused automated maintenance. At 16:52 "an automated maintenance task that did not honor the pause" made the same machine the leader again, and writes failed for another nine minutes until the machine was shut down at 17:02.

## Why it happened

The first failure came from the replacement machine's outdated records. The second came from the pause itself, which had been broken by an update to GitHub's Puppet setup.

## How it ended

Across the two windows up to 26% of Git authentication requests failed and more than 12,000 organisations were affected. No data was lost. The automation now honours the pause.
