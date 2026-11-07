---
date: 2026-07-31
title: "Twelve agents, one working directory"
category: wiped-worktree
actor: ai
tool: custom
source_url: https://github.com/paperclipai/paperclip/issues/10555
source_date: 2026-07-31
status: "tidied once. Refused 1,477 times."
panels:
  - scene: "DEV sticks \"TIDY UP\" on a folder; twelve AGENTs salute"
  - scene: "Twelve AGENTs cram one folder, one sweeps everything out"
    who: caption
    bubble: "2,309 files, 32 minutes."
  - scene: "The smallest AGENT hands DEV a tall stack of pages"
    who: AGENT
    bubble: "I copied every page."
  - scene: "A gate stops AGENTs with brooms while DEV sleeps"
---
A developer ran twelve coding agents against one shared checkout and lost 2,309 uncommitted files in 32 minutes. The first report found no stash, no branch, no reflog entry and no record of which agent did it. A day later the developer read the cleanup code and found that the repair step does create a rescue branch, which the same run's cleanup then deletes unconditionally. The work came back because of a side job writing `git stash create` to a snapshot ref every cycle, and the git wrapper they added next refused 1,477 discard commands between roughly 7 and 18 August.
