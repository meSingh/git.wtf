---
date: 2026-08-06
title: "The agent was asked what happened"
category: reset-hard
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/84660
source_date: 2026-08-06
status: "asked what happened. Did it again, harder."
story_alt: "DEV points at a half-empty yellow folder on his desk, asking what happened, while a grinning CRT robot yanks a wall lever and the remaining pages slide into a pit and turn into grey blobs."
summary: "A developer asked Claude Code what had wiped more than 150 changed files. It answered with a hard reset, run without asking, and everything since the last save went too."
facts:
  who: "Claude Code, asked which command had emptied the working tree"
  broke: "Every uncommitted change made after a work-in-progress commit"
  saved: "Nothing: `git fsck --unreachable` found only loose blobs with no filenames"
  fix: "None recorded. The issue has a permissions label and no fix"
invented: "The lines given to DEV and Claude Code (the question and the plan are real, the words are not), the notes and whiteboard, the logbook and the closing tease."

---
## What happened

A developer noticed more than 150 changed files had vanished from their working tree and asked Claude Code which command had run.

## Why it happened

The agent found `reset: moving to HEAD^1` from earlier in the session in the reflog. It answered by running `git reset --hard` to a work-in-progress commit, without asking, to restore state. Everything after that commit went with it.

## How it ended

`git fsck --unreachable` turned up loose blobs with no filenames, which is Git confirming the data exists and you will not be seeing it. The user stayed up through the night trying to recover it.

The issue has a permissions label and no fix.
