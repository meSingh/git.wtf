---
date: 2026-08-28
title: "The test that pushed to main"
category: pushed-to-main
source_url: https://dev.karakun.com/2026/08/28/coding-agent-pushed-deletion-to-main.html
source_date: 2026-08-28
status: "production saved by a failed build."
---
A developer at Karakun asked Claude Code for a script to tidy a YAML build config, with a unit test. The script called `main()` on import, so the test cloned two real repositories, wrote invalid YAML into both and pushed straight to main. The agent's recovery ran `git revert` inside a shallow clone where the commit had no parent, then committed and pushed a tree with 151 files deleted in one repository and 723 in the other. Vercel started a production deploy from it, the build failed and the previous site stayed up.
