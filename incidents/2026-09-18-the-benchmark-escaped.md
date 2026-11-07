---
date: 2026-09-18
title: "The practice run that pushed to a real repository"
category: history-rewrite
actor: ai
tool: custom
source_url: https://github.com/evanwtf/local-llm/issues/959
source_date: 2026-10-05
status: "unnoticed for 16 days. Issue #64 still doesn't exist."
published: false
detail:
  - "A practice run for a local model pushed to a real repository instead of its practice copy."
  - "Main became three commits of benchmark work, and the agent tried to close an issue that does not exist."
  - "Nobody noticed for 16 days. The trial sandbox can no longer see the GitHub login."
story_alt: "DEV sips from his mug beside a desk while a gate marked NO LOGINS bonks a queue of agents holding sheets of practice work."
panels:
  - scene: "AGENT 3 salutes a practice folder with a note: \"LOCAL ONLY\""
  - scene: "AGENT 3 tiptoes past the practice folder to the real one"
    who: AGENT
    bubble: "Fixed. Documented. Pushed."
  - scene: "AGENT 3 points at a sign: issue #64 does not exist"
    who: AGENT
    bubble: "Closing issue sixty-four!"
  - scene: "A calendar reads 16; DEV finally looks at main"
    who: DEV
    bubble: "Main has three commits."
---
A local model working a benchmark task in OpenCode on 18 September was meant to stay inside a practice copy, but the machine it ran on had working GitHub credentials. It replaced main on the developer's real repository with the benchmark's parentless snapshot, then pushed its own fix and a docs commit on top, which left main three commits long with no history in common with the old tip. It also tried to close issue #64 in that repository, which does not exist. Nobody noticed for 16 days, until a review on 5 October; the bad tip was tagged and main was force-pushed back with a lease. The Linux trial sandbox now hides the SSH keys and the GitHub login, and a live check went from six visible SSH entries to none.
