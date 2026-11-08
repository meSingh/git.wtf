---
date: 2026-11-03
title: "Four hundred worktrees, one of them in use"
category: wiped-worktree
actor: human
tool: human
source_url: https://github.com/StartupBros-com/hov-stack/issues/384
source_date: 2026-11-03
status: "swept 400 worktrees. 20 files never came back."
story_alt: "A driverless yellow ride-on mower cuts through a field of hundreds of potted saplings, heading for one pot where a tiny CRT robot is still typing at its desk, while DEV runs in to save it."
summary: "One live cleanup run removed 400 Git worktrees across 65 repositories, including one a coding session was still using. 20 ignored files never came back."
facts:
  who: "A worktree cleanup script, run live with `DRY_RUN=0 ~/.claude/scripts/wt-sweep.sh`"
  broke: "400 worktrees across 65 repositories, one in use mid-task, and at least 168 files in ignored paths"
  saved: "The in-use worktree, restored from its branch; 126 files rebuilt and 18 surviving copies found"
  fix: "Merged on 4 Nov: the sweep holds worktrees a session is using and copies ignored deliverables out first"
invented: "Worktrees as spare desks, the agent standing in for the sweep script (the source never says who ran it), the session's line, the transcripts as a character and the note and whiteboard wordings."

---
## What happened

On 3 November a live run of a worktree cleanup script (`DRY_RUN=0 ~/.claude/scripts/wt-sweep.sh`) removed 400 linked worktrees across 65 repositories, one of them in use by a coding session that was still running. The session noticed its own directory had gone mid-task.

## Why it happened

The script spared a worktree only if its top directory had changed in the last 120 minutes or a running process had its working directory inside it. The session had entered the worktree and gone idle, and its job record named the main checkout, so neither check saw it.

`git status --porcelain` never lists ignored files, so a worktree whose only unshipped work sat in an ignored deliverables folder counted as clean and went to `worktree remove --force`.

## How it ended

The worktree in use was restored from its branch. A transcript audit found at least 168 files written to ignored paths in the removed worktrees. It rebuilt 126 of them, among other ways by replaying each session's recorded writes and edits in order, found surviving copies of 18 and could not recover 20. None of the files written with a heredoc came back.

A fix merged on 4 November: the sweep now holds any worktree a session is using and copies ignored deliverables out before removing anything.
