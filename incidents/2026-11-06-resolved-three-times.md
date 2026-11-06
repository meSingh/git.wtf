---
date: 2026-11-06
title: "Resolved, three times"
category: github
source_url: https://www.githubstatus.com/history
source_date: 2026-11-06
status: "resolved. Thank you for your patience."
---
On Tuesday 3 November GitHub's Git Operations degraded for an hour and 44 minutes. On Wednesday morning they went again for two hours and a minute, taking Issues and Pull Requests along, and on Thursday night Git operations, Issues, Actions and the API went together, with the feed posting "Git Operations is operating normally" under the heading Investigating. All of them closed with the same sentence, promising a detailed root cause analysis as soon as it is available. On Hacker News someone who had been seeing a third of pushes fail for a fortnight shared their fix, `while ! git push; do sleep 5; done`.
