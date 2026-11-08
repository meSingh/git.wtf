---
date: 2026-08-26
title: "Nothing to clean"
category: wiped-worktree
actor: ai
tool: codex
source_url: https://github.com/openai/codex/issues/40995
source_date: 2026-08-26
status: "cleaned up nothing. Nothing was the repo."
published: false
detail:
  - "A Codex builder used `Path()` to mean \"no stage left to clean up\". In Python, `Path()` is the current directory."
  - "Its cleanup step ran `shutil.rmtree` on it and deleted the checkout, `.git` included, plus the ignored build and artifact folders."
  - "Recloning brought the tracked files back. About 104 MB of ignored checkpoints did not come back."
story_alt: "In a dim office at dawn DEV sleeps at the desk while a boxy CRT robot sweeps with a huge broom; every page of a yellow folder marked REPO blows into the air, and a monitor behind them shows one short line of code."
---
A user left a Codex session running unattended, with approvals off, generating and checking new artifacts in a shared repository. The delegated builder wrote a `finally` block to clean up its temporary stage directory and used `Path()` as the "nothing left to clean" value. In Python `Path()` is `Path(".")`, which exists and is truthy, so at about 06:28 on 26 August `shutil.rmtree` ran on the current directory and took the whole checkout, `.git` included, along with ignored build folders and an artifacts folder holding about 104 MB of checkpoints. Nobody had asked for any cleanup. The agent recloned the repository, which brought back the tracked files; the ignored artifacts stayed gone. A bot flagged the issue as a possible duplicate, and the reporter answered that it wasn't, since the command that did it never contained `rm`. The issue is open with no reply from the maintainers.
