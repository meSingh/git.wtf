---
date: 2026-10-18
title: "Both sides kept, one brace lost"
category: kept-both
actor: human
tool: human
source_url: https://github.com/vitali87/croft/issues/1858
source_date: 2026-10-18
status: "both sides kept. One brace lost. Six for 81."
story_alt: "A smiling CRT robot holds up a yellow picture frame that stays open at one corner, in front of a tall stack of frames, while DEV frowns at the missing corner piece he has picked off the floor."
summary: "A merge tool's Accept Both button kept both sides of a conflict but lost the closing brace they shared, and got 6 of 81 merges in one test file right."
facts:
  who: "A developer testing their own merge tool's Accept Both button on past merges"
  broke: "Accept Both left the first function open and came out right in 6 of 81 merges"
  saved: "Nothing needed saving: the bad results came from replaying old merges"
  fix: "Pull request #1859 merged the next day"
invented: "DEV as the developer, the two branches drawn as AGENT 11 and AGENT 12, DEV's line about the brace, the whiteboard wording, the stack of pages and the tease about the next PR."
---
## What happened

A developer building a merge tool replayed 132 conflicted merges from their own repository and found that 81 of them touched the same test file. On those 81, the tool's Accept Both button gave the right answer six times.

## Why it happened

Git's default conflict style lifts the closing brace both sides share to below the markers and writes it once, so joining the two sides as written left the first function open.

## How it ended

The fix merged the next day in pull request #1859, which closed the issue on 19 October.
