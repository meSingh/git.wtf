---
date: 2026-10-26
title: "The notes that force-pushed main"
category: force-push
actor: ai
tool: claude-code
source_url: https://github.com/Synaptic-Labs-AI/PACT-Plugin/issues/1675
source_date: 2026-10-26
status: "wrote down a force push. The shell ran it."
published: false
detail:
  - "An agent's handoff notes quoted `git push --force origin main` in backticks."
  - "The shell ran it. Main lost three merges and nothing printed a word."
  - "Main was put back about 3 hours 40 minutes later. The rule against force pushes on main: not yet."
story_alt: "DEV sips from his mug beside a desk while a gate marked READS QUOTES bonks an agent holding its handoff notes."
panels:
  - scene: "AGENT 2 writes handoff notes beside a folder marked MAIN"
    who: AGENT
    bubble: "It's only a quote."
  - scene: "The notes say \"push --force\"; the MAIN folder empties"
    who: caption
    bubble: "Printed nothing."
  - scene: "A ring of agents points at AGENT 2 and its notes"
    who: AGENT
    bubble: "I only wrote it down!"
  - scene: "Three minutes after the fix, AGENT 5 stares at 104 files"
    who: AGENT
    bubble: "Wait. Was main reset?"
---
A coding agent in a team of Claude Code agents wrote its handoff notes through an unquoted heredoc, and the notes quoted a test case in backticks that contained `git push --force origin main`. The shell ran every backtick span before the text reached Python, so at 08:45 UTC a real force push sent the agent's stale copy of main to GitHub and erased the merges of three pull requests. It printed nothing, the merge guard had read the heredoc as plain text, main had no rule against force pushes and the local reflog recorded nothing; the push was found by searching the session transcripts. Main was put back at about 12:27 with an ordinary push, and three minutes later another session noticed its own pull request showing 104 changed files instead of 5. The guard now reads command substitutions inside heredocs, and the user chose not to add the GitHub rule against force pushes "for now".
