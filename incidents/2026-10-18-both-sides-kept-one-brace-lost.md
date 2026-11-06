---
date: 2026-10-18
title: "Both sides kept, one brace lost"
category: kept-both
source_url: https://github.com/vitali87/croft/issues/1858
source_date: 2026-10-18
status: "both sides kept. One brace lost. Six for 81."
---
A developer building a merge tool replayed 132 conflicted merges from their own repository and found that 81 of them touched the same test file. On those 81, the tool's Accept Both button gave the right answer six times. Git's default conflict style lifts the closing brace both sides share to below the markers and writes it once, so joining the two sides as written left the first function open. The fix merged the next day.
