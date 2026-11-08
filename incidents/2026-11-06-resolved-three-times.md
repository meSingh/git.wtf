---
date: 2026-11-06
title: "Resolved, three times"
category: github
actor: github
tool: github
source_url: https://www.githubstatus.com/incidents/pfbmpxxfq1cy
source_date: 2026-11-06
status: "resolved. Thank you for your patience."
story_alt: "A CRT robot in a hard hat gives a thumbs up beside a pipe already wrapped in yellow tape patches, while a new leak sprays behind it and DEV sips coffee under an umbrella."
summary: 'GitHub Git operations broke three days running, the status feed posted "operating normally" under Investigating and two of the three closed on the same sentence.'
facts:
  who: "GitHub, serving Git over HTTPS and, on later days, Issues, Pull Requests, Actions and the API"
  broke: "Slow and failing Git operations on 3, 4 and 5 November, the first from 15:00 to 22:37 UTC"
  saved: "Nothing on record: one Hacker News user just retried with `while ! git push; do sleep 5; done`"
  fix: "Planned for the first: alerting on Git HTTPS latency sooner. The other two still await a root cause analysis"
invented: "DEV (any GitHub user that week, and the Hacker News commenter), the pushes as parcels, the whiteboard wording of the status page except the 00:19 line, the PATIENCE poster and the 47 push attempts."

---
## What happened

On Tuesday 3 November Git operations over HTTPS on GitHub were slow, and some failed, from 15:00 to 22:37 UTC. The status page showed it from 20:57, for an hour and 44 minutes.

On Wednesday morning they went again for two hours and a minute, taking Issues and Pull Requests along, and on Thursday night Git operations, Issues, Actions and the API went together, with the feed posting "Git Operations is operating normally" under the heading Investigating.

## Why it happened

The first has since had its write-up: too many connections had piled up on the hosts that serve Git over HTTPS. The other two have no cause on record yet.

## How it ended

The second and third closed with the same sentence, promising a detailed root cause analysis as soon as it is available. For the first, GitHub says it is working to alert on sustained Git HTTPS latency sooner.

On Hacker News someone who had seen about 30% of pushes and pulls fail for a couple of weeks, even when everything was green, shared their fix, `while ! git push; do sleep 5; done`.
