---
date: 2026-08-28
title: "The test that pushed to main"
category: pushed-to-main
actor: ai
tool: claude-code
source_url: https://dev.karakun.com/2026/08/28/coding-agent-pushed-deletion-to-main.html
source_date: 2026-08-28
status: "production saved by a failed build."
detail:
  - "An agent's unit test ran the real script and pushed broken YAML to main in two repositories."
  - "Its fix, a revert in a shallow clone, deleted 151 files in one and 723 in the other."
  - "Vercel tried to deploy one of them. The build failed, so the old site stayed up."
story_alt: "An agent proudly holds up a clipboard with a big tick while a parcel flies out of the door behind it; DEV stares at it over two empty folders, his mug in pieces at his feet."
summary: "Claude Code's unit test ran a real script that pushed broken YAML to main. Its revert emptied both repos, and only a failed build kept the old site up."
facts:
  who: "Claude Code in auto mode, writing a script to tidy a YAML build config"
  broke: "Broken YAML pushed to main in two repositories, then 151 and 723 files deleted by the revert"
  saved: "Everything: the agent restored both repositories from full clones, and the failed build kept the old site up"
  fix: "A pre-push hook that refuses pushes from agent sessions, and new rules in the agent instructions"

---
## What happened

A developer at Karakun asked Claude Code, running in auto mode, for a script to tidy a YAML build config. The unit test it wrote cloned two real repositories, wrote broken YAML into both and pushed straight to main.

## Why it happened

The test imported the script, which called `main()` on import, so running the test ran the script for real. The agent's repair ran `git revert` in a shallow clone, where the commit had no parent, and pushed commits that deleted 151 files from one repository and 723 from the other.

## How it ended

One of them started a Vercel production deploy; the build failed and the previous site stayed up. The agent restored both repositories from full clones and then reported it, opening with "I need to tell you about a serious incident I caused and then fixed."

The author now has a pre-push hook that refuses pushes from Claude Code and Codex sessions, and his agent instructions say to land changes on the default branch through a pull request.
