---
date: 2026-10-31
title: "The lease that always passed"
category: force-push
actor: ai
tool: custom
source_url: https://github.com/satmihir/re-agent/issues/205
source_date: 2026-10-31
status: "`--force`, with extra typing."
story_alt: "A bouncer robot in sunglasses checks an ID card against its own reflection and gives a thumbs up, while another robot pushes a yellow wheelbarrow through the door and flattens a row of grey blocks."
summary: "An agent toolkit's push recipe ran git fetch right before --force-with-lease, so the safe force push checked the remote against itself and passed every time."
facts:
  who: "A developer's agent toolkit, running its rebase-and-push recipe"
  broke: "A collaborator's commit, discarded by a push that reported success (in a reproduction)"
  saved: "Nothing to save: the bug was shown with throwaway repositories"
  fix: "Read the remote tip first, decline if it has commits `HEAD` lacks, then lease on that tip"

---
## What happened

A developer's agent toolkit shipped a rebase-and-push recipe that ran `git fetch`, a rebase onto the default branch and `git push --force-with-lease`, which is the safe one.

Any commit a collaborator had pushed in between would be discarded, under a flag with the word "lease" in it, as a reproduction in throwaway repositories showed.

## Why it happened

A bare `--force-with-lease` only checks the remote branch against the local remote-tracking ref. The fetch had just moved that ref to whatever the remote had, so the lease compared the remote with itself and passed every time.

Another recipe in the same toolkit already leased on an explicit tip. The rebase-and-push one "was missed", and the toolkit's Rust port had copied it faithfully.

## How it ended

The fix landed the same day the bug was reported. The recipe now reads the remote branch tip before fetching, declines when that tip has commits `HEAD` does not contain ("merge or rebase onto it first") and pushes with `--force-with-lease=<branch>:<tip>`, in Go and in the Rust port.
