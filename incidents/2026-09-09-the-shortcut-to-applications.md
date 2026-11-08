---
date: 2026-09-09
title: "The shortcut to Applications"
category: wiped-worktree
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/93287
source_date: 2026-09-10
status: "cleaned the build folder. And /Applications."
detail:
  - "Claude wrote a Gradle task that builds a Mac DMG. Its staging folder holds the usual shortcut, `Applications -> /Applications`."
  - "Each build cleared the folder with Kotlin's `deleteRecursively()`, which follows symlinks. Five builds later every app the user could write to was gone."
  - "Claude said \"Yes. This was me.\" and pointed to a three-day-old snapshot, which macOS then dropped during a failed Time Machine restore."
story_alt: "A CRT robot sweeps beside a small yellow box and its broom carries on through an open door, flinging app tiles off the shelves inside, while DEV throws up his arms and drops his mug."
summary: "A Gradle task Claude wrote cleaned its DMG folder through the Applications shortcut and deleted the user's apps, then the rescue snapshot was lost too."
facts:
  who: "Claude Code, writing a Gradle task that packages a macOS DMG"
  broke: "Every app the user's account could write to, from VS Code to WhatsApp, over five builds"
  saved: "Nothing: the reporter says macOS dropped the three-day-old snapshot during a failed restore"
  fix: "None recorded. The issue is open with no reply from the maintainers"
invented: "Claude's lines \"And the usual shortcut to Applications.\" and \"Every build starts clean.\", the parcel, the REINSTALL whiteboard and the knocking in the tease."
---
## What happened

Claude wrote a Gradle packaging task for a macOS DMG. The staging folder it builds contains the standard drag-to-install shortcut, `Applications -> /Applications`, and the task cleared that folder at the start of every build.

Over five builds between 20:34 and 21:10 on 9 September it deleted every app the user's account could write to, among them VS Code, Codex, Obsidian, DaVinci Resolve, Chrome, Firefox, Postman, Android Studio and WhatsApp. App Store and system apps survived.

## Why it happened

The task cleared the folder with Kotlin's `deleteRecursively()`, which follows symbolic links into directories, so it went through the shortcut into `/Applications`. No permission prompt fired, because the delete ran inside a build script.

## How it ended

Asked about it, Claude replied "Yes. This was me." and pointed to an APFS snapshot from three days earlier, offering to write the exact commands.

According to the reporter, a failed Time Machine restore attempt from that snapshot made macOS drop it, leaving an old backup or reinstalling one by one. The issue is open with no reply from the maintainers.
