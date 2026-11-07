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
