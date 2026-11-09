---
date: 2026-11-01
title: "The robots agreed the code was bad"
category: force-push
actor: ai
tool: custom
source_url: https://github.com/Unthred/DevTest-Infrastructure/issues/158
source_date: 2026-11-01
status: "two bots, one branch, no witnesses."
story_alt: "One CRT robot loads an old dusty box onto a conveyor while the new patched yellow box falls into a bin; a second robot frowns at the old box through a magnifying glass, and DEV stands between them with his mug."
summary: "A rebase bot force-pushed a stale copy of a branch and dropped a 71-line fix, then the review bot rejected the old code it left behind. Nothing reported the loss."
facts:
  who: "An automated rebase job in a developer's agent pipeline, rebasing a pull request"
  broke: "A 71-line fix dropped from the branch, and the pull request hit its fix limit"
  saved: "The fix commit, put back on the branch at 22:03, a minute before the bug was filed"
  fix: "The rebase job now fetches first, checks every commit survived and pushes with `--force-with-lease`"

---
## What happened

On 1 November a developer's automated rebase job picked up a pull request, rebased a stale local copy of the branch instead of the remote head and force-pushed the result, dropping a 71-line fix on the way.

The review bot then read the branch, found the old unfixed code and rejected it. The pull request hit its fix limit.

## Why it happened

The rebase job started from the local copy it already had instead of the remote head. Nothing in the pipeline checked that every commit survived the rebase, so nothing reported that a commit had gone missing.

## How it ended

The bug was filed 14 minutes later, a minute after the fix commit was put back on the branch. A fix for the rebase job merged at 22:45: fetch first, check by patch-id that every commit survived and push with `--force-with-lease`. The closing comment adds: "Merged is not deployed or verified working."

At 23:05 the next rebase of the same pull request started from the old local copy again, though its task named the newer head, and left the fix out a second time.
