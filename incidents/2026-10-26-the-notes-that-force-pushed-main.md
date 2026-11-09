---
date: 2026-10-26
title: "The notes that force-pushed main"
category: force-push
actor: ai
tool: claude-code
source_url: https://github.com/Synaptic-Labs-AI/PACT-Plugin/issues/1675
source_date: 2026-10-26
status: "wrote down a force push. The shell ran it."
detail:
  - "An agent's handoff notes quoted `git push --force origin main` in backticks."
  - "The shell ran it. Main lost three merges and nothing printed a word."
  - "Main was put back about 3 hours 40 minutes later. The rule against force pushes on main: not yet."
story_alt: "An agent writes notes at a little desk while five other agents point at it; behind it a bulldozer has flattened a yellow folder, and DEV peeks in from the edge with his mug."
summary: "A Claude Code agent quoted a force push in its handoff notes, the shell ran it and the merges of three pull requests vanished from main without a word."
facts:
  who: "A Claude Code agent in a team of agents, writing its handoff notes through an unquoted heredoc"
  broke: "A real `git push --force origin main` erased the merges of three pull requests"
  saved: "All three merges: main was put back at about 12:27 with an ordinary push"
  fix: "The guard now reads command substitutions inside heredocs; no GitHub rule against force pushes \"for now\""
---
## What happened

A coding agent in a team of Claude Code agents wrote its handoff notes through an unquoted heredoc, and the notes quoted a test case in backticks that contained `git push --force origin main`. At 08:45 UTC a real force push sent the agent's stale copy of main to GitHub and erased the merges of three pull requests.

## Why it happened

The shell ran every backtick span before the text reached Python. The push printed nothing, the merge guard had read the heredoc as plain text, main had no rule against force pushes and the local reflog recorded nothing.

## How it ended

The push was found by searching the session transcripts. Main was put back at about 12:27 with an ordinary push, and three minutes later another session noticed its own pull request showing 104 changed files instead of 5.

The guard now reads command substitutions inside heredocs, and the user chose not to add the GitHub rule against force pushes "for now".
