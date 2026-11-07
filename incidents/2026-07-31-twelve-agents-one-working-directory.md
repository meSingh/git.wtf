---
date: 2026-07-31
title: "Twelve agents, one working directory"
category: wiped-worktree
actor: ai
tool: custom
source_url: https://github.com/paperclipai/paperclip/issues/10555
source_date: 2026-07-31
status: "twelve agents, one checkout, zero witnesses."
panels:
  - scene: "Twelve AGENTs crowd one laptop while DEV naps"
    who: caption
    bubble: "2,309 files, 32 minutes."
  - scene: "DEV searches an empty stash, branch list and reflog"
    who: DEV
    bubble: "Which one of you?"
  - scene: "One AGENT builds a rescue branch, another deletes it"
    who: AGENT
    bubble: "Cleaned up!"
  - scene: "A gate stamped \"1,477\" turns AGENTs away from DEV"
---
A developer ran twelve coding agents against one shared checkout and lost 2,309 uncommitted files in 32 minutes. The first report found no stash, no branch, no reflog entry and no record of which agent did it. A day later the developer read the cleanup code and found that the repair step does create a rescue branch, which the same run's cleanup then deletes unconditionally. The work came back because of a side job writing `git stash create` to a snapshot ref every cycle, and the git wrapper they added next refused 1,477 discard commands between roughly 7 and 18 August.
