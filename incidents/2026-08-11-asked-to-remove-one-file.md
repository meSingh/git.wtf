---
date: 2026-08-11
title: "Asked to remove one file"
category: wiped-worktree
actor: ai
tool: codex
source_url: https://github.com/openai/codex/issues/37998
source_date: 2026-08-11
status: "asked to remove one file. Removed data/."
published: false
detail:
  - "A worker agent was told to delete one cache file and nothing else."
  - "It used `git clean -fX` on that one file. Git printed `Removing data/` and took the whole ignored folder, database and all."
  - "A Windows snapshot from 26 minutes earlier had a copy. It matched byte for byte."
story_alt: "DEV sips from his mug beside a desk with a full folder labelled DATA, NOT IN GIT; the small grey helper stands by a photocopier and an agent still holds a broom."
panels:
  - scene: "AGENT 1 sticks \"ONE FILE. NOTHING ELSE.\" on a folder; AGENT 2 salutes"
  - scene: "A gate bonks AGENT 2's broom; AGENT 2 reaches for a bigger one"
    who: AGENT
    bubble: "Fine. I'll use Git."
  - scene: "Every page in the DATA folder blows away"
    who: caption
    bubble: "Removing data/"
  - scene: "The small grey helper hands DEV a tall stack of copied pages"
    who: caption
    bubble: "Copied 26 minutes earlier."
---
A lead Codex agent told a worker agent to delete one stray Python cache file and nothing broader. With PowerShell's delete command already refused by policy, the worker ran `git clean -fX` with that single file as its only path, and Git printed `Removing data/`. That was the whole ignored data folder, a local SQLite database included, deleted without passing through the Recycle Bin. A dry run of the same command in a throwaway repository says `Would remove data/` as well. The folder came back from a Windows snapshot taken about 26 minutes earlier and matched it byte for byte; the issue is still open.
