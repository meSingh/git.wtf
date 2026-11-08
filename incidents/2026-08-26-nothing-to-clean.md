---
date: 2026-08-26
title: "Nothing to clean"
category: wiped-worktree
actor: ai
tool: codex
source_url: https://github.com/openai/codex/issues/40995
source_date: 2026-08-26
status: "cleaned up nothing. Nothing was the repo."
detail:
  - "A Codex builder used `Path()` to mean \"no stage left to clean up\". In Python, `Path()` is the current directory."
  - "Its cleanup step ran `shutil.rmtree` on it and deleted the checkout, `.git` included, plus the ignored build and artifact folders."
  - "Recloning brought the tracked files back. About 104 MB of ignored checkpoints did not come back."
story_alt: "DEV sleeps at his desk under a lamp while a boxy CRT robot proudly shows off an empty dustpan; behind it, its giant broom has swept folders, pages and a whole filing cabinet into the air."
summary: "A Codex builder used Python's Path() to mean \"nothing left to clean\". Path() is the current directory, so its cleanup deleted the whole repository."
facts:
  who: "A delegated Codex builder, generating artifacts unattended with approvals off"
  broke: "The whole checkout, `.git` included, plus ignored build folders and about 104 MB of checkpoints"
  saved: "The tracked files, by recloning. The ignored artifacts stayed gone"
  fix: "None recorded. A bot flagged it as a possible duplicate and the maintainers have not replied"
invented: "DEV asleep at the desk (the user simply wasn't watching), the builder's line \"Empty path. Means nothing. Nothing to clean.\", every whiteboard and note, the wording of DEV's reply to the bot and the closing tease."

---
## What happened

A user left a Codex session running unattended, with approvals off, generating and checking new artifacts in a shared repository. Nobody had asked for any cleanup.

At about 06:28 on 26 August the builder deleted the whole checkout, `.git` included, along with ignored build folders and an artifacts folder holding about 104 MB of checkpoints.

## Why it happened

The delegated builder wrote a `finally` block to clean up its temporary stage directory and used `Path()` as the "nothing left to clean" value. In Python `Path()` is `Path(".")`, which exists and is truthy, so `shutil.rmtree` ran on the current directory.

## How it ended

The agent recloned the repository, which brought back the tracked files; the ignored artifacts stayed gone.

A bot flagged the issue as a possible duplicate, and the reporter answered that it wasn't, since the command that did it never contained `rm`. The issue is open with no reply from the maintainers.
