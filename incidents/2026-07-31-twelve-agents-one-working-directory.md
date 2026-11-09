---
date: 2026-07-31
title: "Twelve agents, one working directory"
category: wiped-worktree
actor: ai
tool: custom
source_url: https://github.com/paperclipai/paperclip/issues/10555
source_date: 2026-07-31
status: "tidied once. Refused 1,477 times."
detail:
  - "Twelve AI agents shared one checkout. Thirty-two minutes later, 2,309 uncommitted files were gone."
  - "The repair step had made a rescue branch. The cleanup step deleted it, as cleanup steps do."
  - "The files came back from a side job that copied everything, every cycle. The guard added next said no to 1,477 more attempts to tidy."
story_alt: "DEV sips from his mug beside a desk while a gate arm bonks an agent with a broom; a queue of agents with brooms waits behind it, and the small grey helper stands by a tall stack of copied pages."
summary: "Twelve agents shared one checkout and 2,309 uncommitted files vanished. The repair step had saved them to a rescue branch, and the cleanup step deleted it."
facts:
  who: "Twelve coding agents on one shared checkout, and the platform's own repair and cleanup steps"
  broke: "2,309 uncommitted files deleted in 32 minutes, with no stash, branch or reflog entry left behind"
  saved: "The work, from a side job writing `git stash create` to a snapshot ref every cycle"
  fix: "A git wrapper that refused 1,477 discard commands between roughly 7 and 18 August"

---
## What happened

A developer ran twelve coding agents against one shared checkout and lost 2,309 uncommitted files in 32 minutes. The first report found no stash, no branch, no reflog entry and no record of which agent did it.

## Why it happened

A day later the developer read the cleanup code and found that the repair step does create a rescue branch, which the same run's cleanup then deletes unconditionally. Two features that are each safe on their own combined into the loss.

## How it ended

The work came back because of a side job writing `git stash create` to a snapshot ref every cycle. The git wrapper they added next refused 1,477 discard commands between roughly 7 and 18 August. The issue is still open.
