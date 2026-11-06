---
date: 2026-11-01
title: "The robots agreed the code was bad"
category: force-push
source_url: https://github.com/Unthred/DevTest-Infrastructure/issues/158
source_date: 2026-11-01
status: "two bots, one branch, no witnesses."
---
A developer's automated rebase job picked up a pull request, rebased a stale local copy of the branch instead of the remote head and force-pushed the result, dropping a 71-line fix on the way. The review bot then read the branch, found the old unfixed code and rejected it. The pull request hit its fix limit and nothing in the pipeline reported that a commit had gone missing. The issue was filed by the one human in the loop, after the fact.
