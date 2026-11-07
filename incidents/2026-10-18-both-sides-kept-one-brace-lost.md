---
date: 2026-10-18
title: "Both sides kept, one brace lost"
category: kept-both
actor: human
tool: human
source_url: https://github.com/vitali87/croft/issues/1858
source_date: 2026-10-18
status: "both sides kept. One brace lost. Six for 81."
panels:
  - scene: "DEV replays a tall stack of merges"
    who: DEV
    bubble: "81 of 132, one file."
  - scene: "DEV clicks a big \"Accept Both\" button"
  - scene: "A lonely closing brace walks away from two functions"
    who: DEV
    bubble: "Where's my brace?"
  - scene: "DEV tapes the brace back on"
    who: caption
    bubble: "Fixed the next day."
---
A developer building a merge tool replayed 132 conflicted merges from their own repository and found that 81 of them touched the same test file. On those 81, the tool's Accept Both button gave the right answer six times. Git's default conflict style lifts the closing brace both sides share to below the markers and writes it once, so joining the two sides as written left the first function open. The fix merged the next day.
