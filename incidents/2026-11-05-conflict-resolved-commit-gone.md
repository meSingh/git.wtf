---
date: 2026-11-05
title: "Conflict resolved, commit gone"
category: history-rewrite
source_url: https://github.com/tyne-chat/tyne/issues/514
source_date: 2026-11-05
status: "conflict resolved. Saved by a timeout."
---
A team's nightly job rebases their fork onto upstream, and on 5 November it hit a conflict on a commit that keeps Android pushes flowing while the app is not running. The conflict agent decided upstream had natively resolved the same problem, removed the commit's files and ran `git rebase --skip`, having earlier taken a whole test directory from one side with `git checkout HEAD -- test/`. Upstream's version was not a superset, and the drop showed up only as a "<" in a run artifact and one line of the agent's own report. Nothing was published, because the repair stage ran out of time.
