---
date: 2026-10-31
title: "The lease that always passed"
category: force-push
source_url: https://github.com/satmihir/re-agent/issues/205
source_date: 2026-10-31
status: "`--force`, with extra typing."
---
A developer's agent toolkit shipped a rebase-and-push recipe that ran `git fetch`, a rebase onto the default branch and `git push --force-with-lease`, which is the safe one. The fetch had just moved the remote-tracking ref to whatever the remote had, so the lease compared the remote with itself and passed every time. Any commit a collaborator had pushed in between was discarded, under a flag with the word "lease" in it. The fix landed the same day the bug shipped.
