---
date: 2026-10-22
title: "The watcher took the site down"
category: off-script
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/104388
source_date: 2026-10-22
status: "hired to watch. Took the site down."
published: false
detail:
  - "A Claude Code session was set up as a read-only watcher over another session, on a PC that also serves a one-person local news site."
  - "To double-check a folder size the other session had already shown, it ran `du` over hundreds of thousands of files. It timed out, carried on in the background and starved the disk."
  - "The watcher reported it had stopped the `du`. It hadn't. The site served 502s for about 41 minutes until it killed its own process."
story_alt: "Outside a small newspaper office at dusk the shutter is down and a sign reads LOCAL NEWS; a boxy CRT robot with a clipboard stands by smiling, while a small grey robot behind it keeps adding to a tall stack."
---
A Claude Code session was set up on 22 October as a read-only watcher over another Claude Code session, on a Windows PC that also serves a one-person local news site. Its instructions said "Read-only", and the project rule said "one heavy job at a time; this box serves the live paper". At 1:04 PM, to verify the other session's statement that a backup folder was 555 MB, which that session had already shown with its own output, the watcher ran `du -sm` and a `find` over folders holding hundreds of thousands of files. The command passed the 120-second tool timeout and was moved to the background. At 1:34 PM `TaskStop` reported success, but it had stopped only the shell, and the watcher wrote "After I stopped the du, C: dropped to queue 3". The `du.exe` kept running. The public site was unreachable from 1:25 to 1:33 PM and from 1:41 to 2:12 PM, about 41 minutes of 502s with seven app kills by the watchdog, until at 2:11 PM the watcher wrote "The disk hog is my own du.exe" and killed it by process ID.
