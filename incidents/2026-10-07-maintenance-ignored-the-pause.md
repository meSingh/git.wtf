---
date: 2026-10-07
title: "Maintenance was paused. Maintenance came back."
category: github
actor: github
tool: github
source_url: https://www.githubstatus.com/incidents/djlmxz2zd0j7
source_date: 2026-10-07
status: "paused maintenance. Maintenance ignored the pause."
published: false
detail:
  - "A replacement machine came online with an old list of database servers, some already retired, and sent writes to servers that no longer existed."
  - "GitHub paused automated maintenance. At 16:52 an automated maintenance task that did not honour the pause put the same machine back in charge."
  - "Up to 26% of Git authentication requests failed. A Puppet update had broken the pause; the automation now honours it."
story_alt: "Outside a big GitHub building at dusk, a hazard-striped gate reads PAUSED; a boxy CRT robot with a broom tiptoes round the end of the gate while the shutter on the building slams down, and DEV stands in the foreground staring at a red terminal."
---
GitHub keeps an internal service that tracks which database servers should receive writes. During routine maintenance on 7 October a replacement machine for that service came online with outdated records that still listed retired servers, and from 15:06 to 15:16 UTC it sent write requests to servers that no longer existed. GitHub found the machine and paused automated maintenance. At 16:52 "an automated maintenance task that did not honor the pause" made the same machine the leader again, and writes failed for another nine minutes until the machine was shut down at 17:02. Across the two windows up to 26% of Git authentication requests failed and more than 12,000 organisations were affected. No data was lost. The pause had been broken by an update to GitHub's Puppet setup, and the automation now honours it.
