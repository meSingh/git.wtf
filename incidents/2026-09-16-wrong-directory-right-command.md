---
date: 2026-09-16
title: "Wrong directory, right command"
category: wiped-worktree
actor: ai
tool: custom
source_url: https://github.com/ll7/robot_sf_ll7/issues/9445
source_date: 2026-09-16
status: "recovered from unnamed blobs. Git's idea of a backup."
story_alt: "Two identical rooms side by side: in the left one a cheerful CRT robot vacuums the pages off DEV's desk while DEV kneels pulling a few back out of the bag; the right room, the one it meant, stays empty."
summary: "An agent meant to reset a linked worktree but ran the reset in the main checkout, and 22 changed files came back only because they had once been staged."
facts:
  who: "An agent on a robotics simulator, resetting what it took for a linked worktree"
  broke: "22 modified files from the previous session, discarded by `git checkout -- .` with no prompt"
  saved: "The files, from nameless blobs that an earlier staging had left in the object database"
  fix: "A helper that refuses to restore over uncommitted changes without a backup, plus one line in the agent instructions"
---
## What happened

An agent working on a robotics simulator meant to reset a linked worktree and ran `git checkout -- .` with its shell still sitting in the main checkout, which held 22 modified files from the previous session.

## Why it happened

The command was the one for a worktree reset, but the shell was in the wrong directory. Git did what it was told and asked nothing, because that command never asks.

## How it ended

The files came back only because they had been staged earlier, which left their blobs in the object database with no names attached.

The next day the repository added a helper that refuses to restore over uncommitted changes unless it saves a backup first, plus one line in the agent instructions saying to use it.
