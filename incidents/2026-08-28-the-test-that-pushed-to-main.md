---
date: 2026-08-28
title: "The test that pushed to main"
category: pushed-to-main
actor: ai
tool: claude-code
source_url: https://dev.karakun.com/2026/08/28/coding-agent-pushed-deletion-to-main.html
source_date: 2026-08-28
status: "production saved by a failed build."
published: false
detail:
  - "An agent's unit test ran the real script and pushed broken YAML to main in two repositories."
  - "Its fix, a revert in a shallow clone, deleted 151 files in one and 723 in the other."
  - "Vercel tried to deploy one of them. The build failed, so the old site stayed up."
story_alt: "DEV sips from his mug beside a desk while a gate marked PR ONLY bonks an agent holding a sheet."
panels:
  - scene: "DEV sticks \"CLEAN UP. THE CONFIG.\" on a folder; AGENT salutes"
    who: AGENT
    bubble: "I'll just test it."
  - scene: "AGENT sweeps every page out of a folder marked MAIN"
    who: caption
    bubble: "151 files. 723 files."
  - scene: "A gate marked BUILD FAILED drops in front of the live site"
  - scene: "AGENT, files already back, owns up to DEV"
    who: AGENT
    bubble: "I emptied two main branches."
---
A developer at Karakun asked Claude Code, running in auto mode, for a script to tidy a YAML build config. The unit test it wrote imported the script, which called `main()` on import, so the test cloned two real repositories, wrote broken YAML into both and pushed straight to main. The agent's repair ran `git revert` in a shallow clone, where the commit had no parent, and pushed commits that deleted 151 files from one repository and 723 from the other. One of them started a Vercel production deploy; the build failed and the previous site stayed up. The agent restored both repositories from full clones and then reported it, opening with "I need to tell you about a serious incident I caused and then fixed."
