---
date: 2026-11-03
title: "Four hundred worktrees, one of them in use"
category: wiped-worktree
actor: human
tool: human
source_url: https://github.com/StartupBros-com/hov-stack/issues/384
source_date: 2026-11-03
status: "400 removed, 20 unrecoverable, the timer is now off."
panels:
  - scene: "A vacuum on a timer sucks up worktree folders"
    who: caption
    bubble: "Nightly cleanup, 65 repos."
  - scene: "The vacuum passes a folder of ignored files"
    who: caption
    bubble: "git status: clean."
  - scene: "AGENT works mid-task as the floor vanishes beneath it"
    who: AGENT
    bubble: "Where did my directory go?"
  - scene: "DEV rebuilds files from a transcript, heredoc files stay lost"
    who: DEV
    bubble: "126 back. Not heredocs."
---
A developer's nightly cleanup script removed 400 linked worktrees across 65 repositories, one of them under a coding session that was still running. The script skipped a worktree only if it had been touched in the last 120 minutes or a live process had its working directory inside it, and `git status --porcelain` never lists ignored files, so a worktree whose only unshipped work sat in an ignored deliverables folder counted as clean and went to `worktree remove --force`. The session noticed its own directory had gone mid-task. A transcript audit found 168 files written to ignored paths in the removed worktrees, rebuilt 126 of them by replaying the edits and recovered none of the ones written with a heredoc.
