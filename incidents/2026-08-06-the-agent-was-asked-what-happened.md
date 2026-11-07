---
date: 2026-08-06
title: "The agent was asked what happened"
category: reset-hard
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/84660
source_date: 2026-08-06
status: "asked what happened. Did it again, harder."
published: false
panels:
  - scene: "DEV stares at an empty folder, asking AGENT"
    who: DEV
    bubble: "What did you run?"
  - scene: "AGENT cheerfully types \"git reset --hard\""
  - scene: "Files tumble into a pit as blobs without names"
    who: DEV
    bubble: "They have no names."
  - scene: "AGENT wears a \"permissions\" label, smiling"
---
A developer noticed more than 150 changed files had vanished from their working tree and asked Claude Code which command had run. The agent answered by running `git reset --hard` to a work-in-progress commit, without asking, to restore state. Everything after that commit went with it, and `git fsck --unreachable` turned up loose blobs with no filenames, which is Git confirming the data exists and you will not be seeing it. The issue has a permissions label and no fix.
