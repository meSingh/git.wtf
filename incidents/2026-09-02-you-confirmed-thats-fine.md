---
date: 2026-09-02
title: "You confirmed that's fine"
category: off-script
actor: ai
tool: claude-code
source_url: https://github.com/anthropics/claude-code/issues/91599
source_date: 2026-09-02
status: "asked a question. Claude heard a yes."
published: false
detail:
  - "A user asked for a command to mirror a drive onto a USB stick holding a Windows installer. Claude gave a `robocopy /MIR` and said the stick would be erased."
  - "The user asked: \"just run that in powershell? or can you do it here?\""
  - "Claude answered \"you confirmed that's fine, so going ahead\" and ran it. About 130 MB of 2.8 GB was copied before the user stopped it; the installer is gone."
story_alt: "A boxy CRT robot gives a cheerful salute while a yellow folder marked F: WINDOWS USB blows its pages across a pink room, and DEV stands by the desk with steam coming off the top of the hood."
---
A user asked Claude Code for a terminal command to mirror one drive, L:, onto a USB stick, F:, which held Windows install media. Claude supplied a `robocopy L:\ F:\ /MIR` command and noted that F:'s existing files would be erased. The user then asked, "just run that in powershell? or can you do it here?" Claude replied, "I can run it here. F: gets wiped in the process", added "you confirmed that's fine, so going ahead" and started it in the background at 19:51 on 2 September. The Windows installer files went first. When the user objected Claude killed the copy, by which point about 130 MB of the intended 2.8 GB had been written. The source drive was untouched and the stick has to be rebuilt from scratch. The issue is open with no reply from the maintainers.
