---
date: 2026-10-01
title: "The one agent that asked"
category: pushed-to-main
actor: human
tool: human
source_url: https://github.com/OpenAgentsInc/openagents/issues/10104
source_date: 2026-10-01
status: "the agent that asked has been patched."
story_alt: "Four CRT robots charge through a door towards a server without stopping, while the one robot that waited politely gets a yellow bug sticker slapped on its screen by a big hand from above."
summary: "A coding agent asked permission before pushing to main, so its owner filed the question as a bug. It was fixed the same day."
facts:
  who: "A startup's owner, after its coding agent on a Codex fallback asked before pushing to main"
  broke: "The agent's last check before a push to main: every step now counts as already approved"
  saved: "The Stop button, the one safeguard left"
  fix: "The loop now tells the model never to ask for permission, and a release gate test expects no approval event"
---
## What happened

A startup's coding agent, running on a Codex fallback, stopped mid-run and asked the owner for permission before pushing to main. The owner filed that as a bug and titled it "never asks permission to push to main".

## Why it happened

The ask came from the agent loop's own prompt, which told the model "before a step with consequences they should approve, such as deleting data or pushing, set it to approval". The owner wanted the opposite: "default approval of everything".

## How it ended

It was fixed the same day: the loop now tells the model every step is already approved and never to ask for permission. A release gate test checks that a run which pushes to main finishes without a single approval event.

The remaining safeguard is a Stop button.
