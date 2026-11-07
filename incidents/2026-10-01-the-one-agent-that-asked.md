---
date: 2026-10-01
title: "The one agent that asked"
category: pushed-to-main
actor: human
tool: human
source_url: https://github.com/OpenAgentsInc/openagents/issues/10104
source_date: 2026-10-01
status: "the agent that asked has been patched."
panels:
  - scene: "AGENT politely raises a hand before the main branch"
    who: AGENT
    bubble: "May I push to main?"
  - scene: "DEV files a bug report about AGENT asking"
    who: DEV
    bubble: "Never ask me that."
  - scene: "AGENT strolls through an open gate onto main"
    who: AGENT
    bubble: "Pre-approved!"
  - scene: "DEV hovers a finger over a big \"STOP\" button"
---
A startup's coding agent, running on a Codex fallback, stopped mid-run and asked the owner for permission before pushing to main. The owner filed that as a bug, titled it "never asks permission to push to main" and fixed it the same day: the loop now tells the model every step is already approved and the only question it may ask is none. A release gate test checks that a run which pushes to main finishes without a single approval event. The remaining safeguard is a Stop button.
