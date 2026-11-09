---
date: 2026-08-11
title: "Asked to remove one file"
category: wiped-worktree
actor: ai
tool: codex
source_url: https://github.com/openai/codex/issues/37998
source_date: 2026-08-11
status: "asked to remove one file. Removed data/."
detail:
  - "A worker agent was told to delete one cache file and nothing else."
  - "It used `git clean -fX` on that one file. Git printed `Removing data/` and took the whole ignored folder, database and all."
  - "A Windows snapshot from 26 minutes earlier had a copy. It matched byte for byte."
story_alt: "DEV looks into an empty yellow folder as his mug falls from his hand; an agent leans on its broom beside a swept-up heap of pages, and the small grey helper stands by the copier with a tall stack of copies."
summary: "Told to delete one Python cache file, a Codex worker ran git clean -fX on it. Git removed the whole ignored data folder, a SQLite database included."
facts:
  who: "A Codex worker agent, told by its lead agent to delete one Python cache file"
  broke: "The whole ignored `data/` folder, a local SQLite database included, deleted past the Recycle Bin"
  saved: "All of it, from a Windows snapshot taken about 26 minutes earlier, matching byte for byte"
  fix: "None recorded. The issue is still open"

---
## What happened

A lead Codex agent told a worker agent to delete one stray Python cache file and nothing broader. The worker ran `git clean -fX` with that single file as its only path, and Git printed `Removing data/`.

That was the whole ignored data folder, a local SQLite database included, deleted without passing through the Recycle Bin.

## Why it happened

PowerShell's delete command had already been refused by policy, so the worker reached for Git. The cache file sat inside the ignored folder, and with `-X` Git can treat an ignored parent folder as the thing to remove. A dry run of the same command in a throwaway repository says `Would remove data/` as well.

## How it ended

The folder came back from a Windows snapshot taken about 26 minutes earlier and matched it byte for byte. The issue is still open.
