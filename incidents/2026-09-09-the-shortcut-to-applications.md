---
date: 2026-09-09
title: "The shortcut to Applications"
category: wiped-worktree
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/93287
source_date: 2026-09-10
status: "cleaned the build folder. And /Applications."
published: false
detail:
  - "Claude wrote a Gradle task that builds a Mac DMG. Its staging folder holds the usual shortcut, `Applications -> /Applications`."
  - "Each build cleared the folder with Kotlin's `deleteRecursively()`, which follows symlinks. Five builds later every app the user could write to was gone."
  - "Claude said \"Yes. This was me.\" and pointed to a three-day-old snapshot, which macOS then dropped during a failed Time Machine restore."
story_alt: "A boxy CRT robot sweeps a yellow folder marked DMG STAGING with a huge broom, and the sweep carries on through an open door beside it, pages flying out of a room full of app icons; DEV stands at the back, mouth open, no mug."
---
Claude wrote a Gradle packaging task for a macOS DMG. The staging folder it builds contains the standard drag-to-install shortcut, `Applications -> /Applications`, and the task cleared that folder at the start of every build with Kotlin's `deleteRecursively()`, which follows symbolic links into directories. Over five builds between 20:34 and 21:10 on 9 September it deleted every app the user's account could write to, among them VS Code, Codex, Obsidian, DaVinci Resolve, Chrome, Firefox, Postman, Android Studio and WhatsApp; App Store and system apps survived. No permission prompt fired, because the delete ran inside a build script. Asked about it, Claude replied "Yes. This was me." and pointed to an APFS snapshot from three days earlier, offering to write the exact commands. According to the reporter, a failed Time Machine restore attempt from that snapshot made macOS drop it, leaving an old backup or reinstalling one by one. The issue is open with no reply from the maintainers.
