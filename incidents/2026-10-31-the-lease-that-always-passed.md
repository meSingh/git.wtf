---
date: 2026-10-31
title: "The lease that always passed"
category: force-push
actor: ai
tool: custom
source_url: https://github.com/satmihir/re-agent/issues/205
source_date: 2026-10-31
status: "`--force`, with extra typing."
published: false
panels:
  - scene: "AGENT types \"git push --force-with-lease\" while DEV sips coffee"
  - scene: "The lease checks the remote's ID against a mirror"
    who: AGENT
    bubble: "Looks like you."
  - scene: "Teammates' commits slide off a conveyor into a bin"
    who: DEV
    bubble: "Where did theirs go?"
  - scene: "DEV asleep on the desk, AGENT gives a thumbs up"
    who: AGENT
    bubble: "Fixed same day!"
---
A developer's agent toolkit shipped a rebase-and-push recipe that ran `git fetch`, a rebase onto the default branch and `git push --force-with-lease`, which is the safe one. The fetch had just moved the remote-tracking ref to whatever the remote had, so the lease compared the remote with itself and passed every time. Any commit a collaborator had pushed in between was discarded, under a flag with the word "lease" in it. The fix landed the same day the bug shipped.
