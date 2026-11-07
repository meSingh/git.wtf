---
date: 2026-09-16
title: "Wrong directory, right command"
category: wiped-worktree
actor: ai
tool: custom
source_url: https://github.com/ll7/robot_sf_ll7/issues/9445
source_date: 2026-09-16
status: "recovered from unnamed blobs. Git's idea of a backup."
published: false
panels:
  - scene: "AGENT stands in the main checkout, thinking it's the worktree"
    who: AGENT
    bubble: "Resetting the worktree!"
  - scene: "AGENT runs a checkout and 22 files vanish silently"
    who: caption
    bubble: "Git printed nothing."
  - scene: "DEV digs nameless blobs out of the object database"
    who: DEV
    bubble: "Thank you, staging."
  - scene: "A sign on the checkout door: \"clean status only\""
---
An agent working on a robotics simulator meant to reset a linked worktree and ran `git checkout -- .` with its shell still sitting in the main checkout, which held 22 modified files from the previous session. Git did what it was told and printed nothing, because that command has never printed anything. The files came back only because they had been staged earlier, which left their blobs in the object database with no names attached. The repository now requires a clean status or a backup before any checkout restore.
