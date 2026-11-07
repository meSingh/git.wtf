---
date: 2026-10-23
title: "The key that was deleted three hours later"
category: committed-secret
actor: human
tool: human
source_url: https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain
source_date: 2026-10-23
status: "deleted in May. Still there in October."
panels:
  - scene: "DEV commits a key, then deletes it"
    who: DEV
    bubble: "Gone in three hours."
  - scene: "A gloved hand lifts the key out of Git's history"
    who: caption
    bubble: "October."
  - scene: "A box labelled \"1.107.0\" ships with a poison sticker"
  - scene: "DEV force-pushes main back, racing a stopwatch"
    who: caption
    bubble: "18 minutes later."
---
In May a config file carrying an admin key was committed to one of LiteLLM's public repositories and deleted three hours later, which in Git means it stayed. In October someone found it, used it to collect a maintainer's token and pushed a release workflow change to main through branch protection, then shipped a poisoned 1.107.0 to PyPI. Eighteen minutes after a researcher opened an issue, main was force-pushed back to the previous commit over the force-push block, which left both commits retrievable by SHA and an audit log entry for every override.
