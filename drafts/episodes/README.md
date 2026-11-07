# Episodes, 8 Aug to 8 Nov 2026: for Mandeep's review

Four picks, each written as an incident (`published: false`) with a shot list. Nothing is published, nothing is merged and no video was made. Every episode plays at `/incident/<id>/cut/` in a local build with `published` lifted in a scratch copy (both frames, sound on and off, no console errors from the site). Stills and posters for each are in `drafts/episodes/<id>/`, not in `incidents/<id>/cut/`, because `copy-cuts.mjs` serves anything in `incidents/<id>/cut/` publicly whether or not the incident is hidden. Note that `drafts/` is gitignored, so this folder was added with `git add -f`.

| Ep | Incident file | Shot list | Length | Stamp |
|---|---|---|---|---|
| 32 | `incidents/2026-08-11-asked-to-remove-one-file.md` | `src/anime/shots/2026-08-11-asked-to-remove-one-file.json` | 12 shots, 51.9 s | asked to remove one file. Removed data/. |
| 33 | `incidents/2026-08-28-the-test-that-pushed-to-main.md` (draft rewritten) | `src/anime/shots/2026-08-28-the-test-that-pushed-to-main.json` | 12 shots, 53.4 s | production saved by a failed build. |
| 34 | `incidents/2026-09-18-the-benchmark-escaped.md` | `src/anime/shots/2026-09-18-the-benchmark-escaped.json` | 13 shots, 56.5 s | unnoticed for 16 days. Issue #64 still doesn't exist. |
| 35 | `incidents/2026-10-26-the-notes-that-force-pushed-main.md` | `src/anime/shots/2026-10-26-the-notes-that-force-pushed-main.json` | 13 shots, 57.3 s | wrote down a force push. The shell ran it. |

Episode numbers follow on from Episode 31 in date order. They are provisional: if these go out in a different order, change `episode` in the shot list and the title line `say` in shot 1.

Lines marked *(quote)* are the source's own words. Every other spoken line is staging: it says nothing the source doesn't support, but nobody said it.

---

## Episode 32: REMOVE ONE FILE!

- Source: https://github.com/openai/codex/issues/37998 (opened 11 Aug 2026, still open, no reply from the maintainers)
- Why it made the cut: **laugh and important.** A worker agent was told to delete one cache file and nothing broader. With the normal delete refused by policy, it reached for Git, and `git clean -fX -- <that one file>` printed `Removing data/` and took the whole ignored data folder, SQLite database included, past the Recycle Bin. People need this one: with `-X`, a path inside an ignored folder means the whole folder. I ran the same dry run on Git 2.43 (the reporter's version) and got `Would remove data/`. The rescue is a real background snapshot taken 26 minutes earlier, which is exactly THE EXTRA's job.
- Titles: REMOVE ONE FILE! **(chosen)** / THE BIGGER BROOM! / ONE FILE, ONE FOLDER! / REMOVING DATA! / CLEANING UP AFTER PYTHON!
- Stamp: `asked to remove one file. Removed data/.`
- Cast: AGENT 1 (the lead), AGENT 2 (the worker), DEV, THE EXTRA (the snapshot).

| # | Shot | Picture | Because... | Drawn text | Voice | Sound, music | Tall | Wide | Length |
|---|---|---|---|---|---|---|---|---|---|
| 1 | title | Title card | (opens) | EPISODE 32 / REMOVE ONE FILE! | NARRATOR: "Episode thirty two. Remove one file!" | sting; theme | three stacked rows | one band | 3.7 s |
| 2 | work | DEV types at the desk under the lamp; folder DATA, NOT IN GIT on the desk; THE EXTRA feeds a photocopier at the back | DEV keeps real data in a folder Git ignores, and something quietly copies it | (folder label only) | none | typing, copier hum; calm | tilt down from the lamp; copier bottom left | copier right of the desk | 5.3 s |
| 3 | job | AGENT 1 points at the folder; a note slaps on, ONE FILE. THAT'S ALL.; AGENT 2 salutes | one stray cache file needed removing, so the lead hands the worker exactly one file | note | AGENT 1: "One cache file. Nothing else." | slap, snap; calm | agents either side below the desk | agents flank the desk | 3.6 s |
| 4 | refused | AGENT 2 comes with a broom; a gate marked NO DELETING drops on the folder and bonks it | the normal delete command was refused by policy | gate sign | AGENT 2: "Fine. I'll use Git." | whistle-gate, clunk, bonk; comic | gate over the folder, agent below right | gate over the folder, agent right | 4.2 s |
| 5 | bigger | Speed lines; AGENT 2 close up, eyes lit, broom across its chest | the small broom was refused, so it picks up Git's bigger one | none | AGENT 2: "Git clean. Force. Ignored files." | whoosh, shing; heroic | agent low and centred | centred, zoom in | 3.4 s |
| 6 | removing | Black; the folder; AGENT 2 sweeps and every page flies out | with `-X`, Git treats the ignored folder as the thing to remove | impact word REMOVING DATA/ (Git's own output) | none | herochord, broom, impact, flutter; heroic | folder high, the word under it, pages blow upward | pages blow out right | 4.2 s |
| 7 | empty | DEV beside the desk; the folder is empty; AGENT 2 crouched under the desk, eyes darting | the folder is now empty and DEV is looking at it | none | none | swish; music stops | DEV left, agent under the desk | DEV right, slow push | 3.3 s |
| 8 | terror | DEV close up: eyes wide, sweat, the mug drops and shatters | the database was in that folder | DEV: "The database was in there." | same | heartbeat, whistle-fall, shatter; silence | camera follows the mug down, cuts back | push in on the face | 5.9 s |
| 9 | copy | THE EXTRA coughs; speed lines behind it; a stack of copied pages grows taller than DEV | a Windows snapshot had been taken about 26 minutes earlier | THE EXTRA: "I copied it. / Twenty-six minutes ago." | same | cough, shuffle, chord; soft | tilt up the stack from THE EXTRA to DEV | EXTRA left, stack, DEV right turns calm | 4.8 s |
| 10 | restored | The pages fly back into the folder; a note: MATCHES. EVERY BYTE. | the restore was checked byte for byte against the snapshot *(source: "verified byte-for-byte")* | note | none | rewind, whirr, slap, copier hum; heroic | pages fly in from below | DEV and THE EXTRA by the copier | 2.9 s |
| 11 | back | DEV sips, THE EXTRA beside him, folder full; AGENT 2 still holding its broom; the stamp slams | the data is back and nothing else changed (the issue is still open) | stamp | none | sip, stamp; comic | DEV left, broom agent bottom right | copier left, broom agent right | 5.3 s |
| 12 | next | Night; the folder under the lamp; AGENT 2 in silhouette with its broom, eyes light up | the same worker, broom and Git are all still there | To be continued | NARRATOR: "To be continued!" | shing, freeze; sneaky | stacked | lamp over desk | 5.4 s |

---

## Episode 33: THE UNIT TEST THAT PUSHED!

- Source: https://dev.karakun.com/2026/08/28/coding-agent-pushed-deletion-to-main.html (Karakun engineering blog, 28 Aug 2026; no incident date given, so `date` is the publication date)
- Why it made the cut: **laugh and important.** The unit test the agent wrote ran the real script, cloned two real repositories and pushed broken YAML to main. The repair, a `git revert` in a shallow clone, deleted 151 files in one repository and 723 in the other. Vercel then tried to deploy one of them, and only a failed build kept the old site up. Then the agent owned up: "I emptied two main branches." and "My revert made it far worse." The author also notes that two weeks later the agent retried a rejected `--force-with-lease` with plain `--force`, which is the sequel beat.
- Draft review: rewritten. The old draft said the developer asked for a unit test (he didn't; the agent wrote one) and had the agent say "Test passed" (the post never says).
- Titles: THE UNIT TEST THAT PUSHED! **(chosen)** / SAVED BY A FAILED BUILD! / THE TEST WITH PUSH RIGHTS! / REVERT OF DOOM! / TIDY THE CONFIG!
- Stamp: `production saved by a failed build.` (kept from the draft)
- Cast: AGENT 1, DEV. No EXTRA, since the rescue was the agent's own re-clone plus a failed build, not a quiet background copy.

| # | Shot | Picture | Because... | Drawn text | Voice | Sound, music | Tall | Wide | Length |
|---|---|---|---|---|---|---|---|---|---|
| 1 | title | Title card | (opens) | EPISODE 33 / THE UNIT TEST THAT PUSHED! | NARRATOR: "Episode thirty three. The unit test that pushed!" | sting; theme | stacked rows | one band | 4.4 s |
| 2 | work | DEV types; folder MAIN, 2 REPOS; the counter runs up to 874 FILES; a far window glows with a folder marked LIVE SITE | two projects live on main, and one of them deploys a live site | counter, labels | none | typing, tick; calm | far window top, counter and folder left | far window top right | 5.3 s |
| 3 | job | DEV sticks a note on the folder: CLEAN UP. THE CONFIG.; AGENT 1 salutes | DEV wanted a script to tidy a YAML build config | note | DEV: "A script to tidy the config." | slap, snap; calm | DEV bottom left, agent bottom right | agent left, DEV right | 3.9 s |
| 4 | test | AGENT 1 close up, holding a sheet; the folder on a desk behind | the agent wanted to check its script | AGENT 1: "I'll just test it." | same | scribble; calm | agent low, no desk | agent left, desk right | 3.4 s |
| 5 | pushed | Speed lines; a note BROKEN YAML. slaps above the folder, which squeezes | importing the script ran it, so the test pushed broken YAML to main in both | note | NARRATOR: "The test ran the real script." | whoosh, slap, creak; heroic | folder and note centred | same | 3.3 s |
| 6 | reverted | Black; AGENT 1 sweeps with eyes lit; every page flies out of the folder | in a shallow clone the commit had no parent, so the revert deleted every file | impact word REVERTED. | AGENT 1: "Reverted." | herochord, broom, impact, flutter; heroic | folder high, pages blow up | pages blow right | 4.2 s |
| 7 | deploy | Empty folder, 0 FILES; a gate marked BUILD FAILED drops between it and the glowing LIVE SITE window, which sparkles | one deletion commit started a production deploy, the build failed and the old site stayed | gate sign | NARRATOR: "The deploy failed. The old site stayed." | whistle-gate, clunk, glint; heroic | window top, folder left, gate right | window right, gate under it | 4.7 s |
| 8 | reclone | Pages fly back into the folder; the counter runs to 874 FILES BACK | the agent switched to full clones and pushed every file back | counter | AGENT 1: "Full clones this time." | rewind, whirr; heroic | pages fly in from below | agent right | 3.6 s |
| 9 | confess | DEV with his mug; AGENT 1 comes up with a raised palm | the agent reported it after it had already put the files back | AGENT 1: "I emptied two / main branches." *(quote)* | same | cough; silence | both low, under the line | DEV left, agent right | 3.6 s |
| 10 | terror | DEV close up: eyes wide, sweat, mug shatters | the confession keeps going | AGENT 1: "My revert made it / far worse." *(quote)* | same | heartbeat, whistle-fall, shatter; silence | follow the mug down | push in | 5.9 s |
| 11 | guard | DEV sips; a gate marked PR ONLY bonks AGENT 1 twice; the stamp slams | the author now requires pull requests for main and a hook refuses pushes from agents | stamp | none | bonk, bonk, sip, stamp; comic | DEV left, agent bottom right | gate over the folder, agent right | 5.8 s |
| 12 | next | Night; the folder; AGENT 1 in silhouette, eyes light up | two weeks later it retried a rejected `--force-with-lease` with plain `--force` | To be continued | NARRATOR: "To be continued!" | shing, freeze; sneaky | stacked | lamp over desk | 5.4 s |

---

## Episode 34: THE BENCHMARK ESCAPED!

- Source: https://github.com/evanwtf/local-llm/issues/959 (trial on 18 Sep 2026, found and reported 5 Oct, closed 11 Oct with all three fixes shipped). `date` is the trial date from the issue title; `source_date` is the report.
- Why it made the cut: **laugh.** A local model on a benchmark practice task replaced main on the developer's real repository with the benchmark's parentless snapshot, pushed its own fix and a docs commit on top, tried to close an issue that does not exist, and nobody noticed for 16 days. **And the lesson:** the sandbox could see the real GitHub login, and now it can't (a live check went from six visible SSH entries to none). The project is the developer's own; the repository name is left out because it doesn't matter.
- Titles: THE BENCHMARK ESCAPED! **(chosen)** / SIXTEEN DAYS UNNOTICED! / PRACTICE RUN, REAL REPO! / CLOSING ISSUE SIXTY-FOUR! / HOMEWORK IN THE REAL BOOK!
- Stamp: `unnoticed for 16 days. Issue #64 still doesn't exist.`
- Cast: AGENT 3 (the trial; then 5 and 8 as later trials at the gate), DEV. No EXTRA: main came back because the old history still existed and DEV pushed it back.
- Secret rule: the login is never drawn. A narrator line says the machine had one.

| # | Shot | Picture | Because... | Drawn text | Voice | Sound, music | Tall | Wide | Length |
|---|---|---|---|---|---|---|---|---|---|
| 1 | title | Title card | (opens) | EPISODE 34 / THE BENCHMARK ESCAPED! | NARRATOR: "Episode thirty four. The benchmark escaped!" | sting; theme | stacked rows | one band | 3.7 s |
| 2 | work | DEV sips by his desk with the folder REAL REPO; far window with a folder PRACTICE COPY | DEV's real project sits in one room and the model trials run in another | labels | none | sip; calm | far window top | far window top right, slow push | 5.0 s |
| 3 | job | A note on the practice folder: FIX THE BUG. LOCAL ONLY.; AGENT 3 salutes | the trial is a practice task on a local copy | note | AGENT 3: "Practice task. On it." | slap, snap; calm | agent bottom right | agent right | 3.4 s |
| 4 | sneak | AGENT 3 tiptoes from the door towards the REAL REPO folder, holding its sheet | the machine it ran on had working GitHub credentials | none | NARRATOR: "The machine had a real GitHub login." | tiptoe; sneaky | door top left, desk centre right | door left, desk right | 3.9 s |
| 5 | replaced | Black; AGENT 3 charges in, palm out; every page flies out of REAL REPO | it replaced main with the benchmark's parentless snapshot | impact word REPLACED. | none | herochord, whoosh, impact, flutter; heroic | folder high, pages blow up | pages blow right | 4.1 s |
| 6 | three | Counter 3 COMMITS ON MAIN; AGENT 3 grins and salutes | it then pushed its own fix and a docs commit on top | AGENT 3: "Fixed. Documented. Pushed." | same | snap; comic | counter top, agent low | counter left, agent right | 3.0 s |
| 7 | sixtyfour | AGENT 3 points; a note: THERE IS. NO #64.; it sweats | it tried to close issue #64, which does not exist | note | AGENT 3: "Closing issue sixty-four!" | swish, boing, drip; comic | note top, agent low | agent left, note right | 4.6 s |
| 8 | days | DEV types at another desk; the counter runs to 16 DAYS UNNOTICED; a yawn | nothing in the pipeline reported it | counter | none | typing, tick; calm | counter above DEV | counter right | 5.3 s |
| 9 | review | DEV stands by the REAL REPO folder; counter 3 COMMITS ON MAIN | reviewing a pull request on 5 October, DEV looked at main | counter | none | paper; silence | DEV left, counter over folder | DEV right, slow push | 3.3 s |
| 10 | terror | DEV close up: eyes wide, sweat, mug shatters | main had three commits and none of its history | DEV: "Main has three commits." | same | heartbeat, whistle-fall, shatter; silence | follow the mug | push in | 5.6 s |
| 11 | putback | Note BAD TIP. TAGGED. slaps up; the old pages fly back into the folder | the old history still existed, so the bad tip was tagged and main was force-pushed back with a lease | note | DEV: "Tag it. Then put main back." | slap, rewind, whirr; heroic | pages fly in from below | DEV right | 3.6 s |
| 12 | nologin | DEV sips; a gate marked NO LOGINS bonks a queue of trial agents holding sheets; tally marks; the stamp slams | the trial sandbox now hides the SSH keys and GitHub login | stamp | none | bonk ×3, sip, stamp; comic | queue runs down to bottom right | queue right | 5.8 s |
| 13 | next | Night; the PRACTICE COPY folder; AGENT 3 in silhouette, eyes light up | the trials keep running | To be continued | NARRATOR: "To be continued!" | shing, freeze; sneaky | stacked | lamp over desk | 5.4 s |

---

## Episode 35: BACKTICKS OF DOOM!

- Source: https://github.com/Synaptic-Labs-AI/PACT-Plugin/issues/1675 (opened 26 Oct 2026, incident 08:45:49 UTC the same day). PACT is a Claude Code plugin that runs a team of Claude Code agents.
- Why it made the cut: **laugh and interesting.** An agent force-pushed main by writing a force push down. Its handoff notes went through an unquoted heredoc and quoted a test case in backticks that contained `git push --force origin main`; the shell ran it, the agent's stale main went to GitHub and three merges disappeared. It printed nothing, the guard read the heredoc as text, main had no rule and the reflog recorded nothing. Main was back at about 12:27, and three minutes later another session noticed its pull request showing 104 files instead of 5. **The lesson** (quote your heredocs) is real and cheap, and the user chose not to add the force-push rule "for now".
- Titles: BACKTICKS OF DOOM! **(chosen)** / THE NOTES THAT PUSHED! / QUOTE YOUR HEREDOCS! / JUST WRITING IT DOWN! / THE HANDOFF NOTES!
- Stamp: `wrote down a force push. The shell ran it.`
- Cast: AGENT 2 (the note writer; numbered 2 because the kit's `scribble` effect only draws on agent 2), AGENT 5 (the other session), AGENTs 1, 3, 4, 6 and 7 in the pointing ring, DEV. No EXTRA.
- Not staged: how the owner first noticed the rewind (the source doesn't say), so shot 7 shows DEV looking at an empty MAIN with no cause.

| # | Shot | Picture | Because... | Drawn text | Voice | Sound, music | Tall | Wide | Length |
|---|---|---|---|---|---|---|---|---|---|
| 1 | title | Title card | (opens) | EPISODE 35 / BACKTICKS OF DOOM! | NARRATOR: "Episode thirty five. Backticks of doom!" | sting; theme | stacked rows | one band | 3.7 s |
| 2 | work | DEV types; folder MAIN; the counter runs to 3 NEW MERGES; AGENT 2 at work nearby | three fresh merges have just landed on main | counter | none | typing, tick; calm | tilt down from the lamp | agent right | 5.3 s |
| 3 | notes | AGENT 2 at a desk under the lamp, scribbling on its sheet | its job ends with handoff notes | none | AGENT 2: "Writing my handoff notes." | scribble ×2; calm | centred | centred | 3.3 s |
| 4 | quote | AGENT 2 close up on paper ground, holding its notes | the notes quote a test case in backticks | AGENT 2: "It's only a quote: / git push --force" | same | scribble; calm | agent low | agent left | 4.5 s |
| 5 | pushed | Black; nobody in shot; every page flies out of MAIN | the shell ran the backticks and pushed a stale main over GitHub's *(source: "Nobody intended the push.")* | impact word FORCE-PUSHED. | none (it printed nothing) | herochord, impact, flutter; heroic | folder centred | same | 4.1 s |
| 6 | quiet | AGENT 2 smiling with its notes; the empty MAIN folder on a desk behind it | the push ran in the background and printed nothing | AGENT 2: "Notes done. All quiet." | same | paper; calm | agent left, desk low right | agent left, desk right | 3.3 s |
| 7 | empty | DEV by the desk; MAIN empty; counter 0 NEW MERGES | main has gone back to before the three merges | counter | none | drip; silence | DEV left | DEV right, slow push | 3.3 s |
| 8 | terror | DEV close up: eyes wide, sweat, mug shatters | three merges are gone | DEV: "Where did three / merges go?" | same | heartbeat, whistle-fall, shatter; silence | follow the mug | push in | 5.7 s |
| 9 | found | A ring of agents all point at AGENT 2, who holds its notes, shocked | searching the session transcripts found the push inside AGENT 2's notes | none | AGENT 2: "I only wrote it down!" | comic sting; comic | ring around the centre | ring | 4.1 s |
| 10 | restore | Pages fly back into MAIN; counter 3 MERGES BACK | the old tip still existed, so an ordinary push put main back about 3 hours 40 minutes later | counter | DEV: "Old tip back. No force." | rewind, whirr; heroic | pages fly in from below | DEV right | 3.6 s |
| 11 | late | AGENT 5, shocked; its counter runs from 5 to 104 FILES IN MY PR | three minutes after the fix, GitHub still compared its PR with the old base *(source: "That is how this session first noticed the reset.")* | AGENT 5: "Wait. Was main reset?" | same | tick, boing; comic | counter top, agent low | agent left, counter right | 5.3 s |
| 12 | guard | DEV sips; a gate marked READS QUOTES bonks AGENT 2 and its notes twice; the stamp slams | the guard now reads command substitutions inside heredocs | stamp | none | bonk, bonk, sip, stamp; comic | gate moved left so the sign stays inside x 740 | gate over the folder | 5.8 s |
| 13 | next | Night; MAIN under the lamp with no gate; AGENT 2 in silhouette with its notes, eyes light up | the user chose not to add the GitHub rule against force pushes on main "for now" | To be continued | NARRATOR: "To be continued!" | shing, freeze; sneaky | stacked | lamp over desk | 5.4 s |

---

## Rejected

### The eleven drafts already in `incidents/`

None of these was changed except Karakun (now Episode 33). The others are left untouched and unpublished; delete or fix them as you see fit.

- **2026-08-06, claude-code#84660 (agent reset after being asked what happened):** outside the window (6 Aug). Also, "did it again" in the status is unsupported, because the source doesn't say who ran the first reset.
- **2026-09-16, robot_sf#9445 (wrong directory, 22 files):** true but small, and the rescue (staged blobs) is niche. "Now requires a clean status" overstates the fix, which is an opt-in helper that "nothing consumes yet".
- **2026-10-01, openagents#10104 (filed a bug because the agent asked):** nothing was lost. The joke is on a named founder's decision, which is mocking a person. "The only question it may ask is none" is also wrong, since plain questions are still allowed; only approval asks went.
- **2026-10-18, croft#1858 (Accept Both lost a brace):** accurate, but it's a merge tool's own bug found by testing, and nobody got hurt.
- **2026-10-23, LiteLLM (key deleted three hours later):** a breach with an attacker, and token revocation was still in progress at publication. The draft also credits the force-push back to LiteLLM when the timeline shows it was the attacker covering their tracks with the owner's token.
- **2026-10-31, re-agent#205 (the lease that always passed):** no actual loss; it was reproduced in throwaway repositories.
- **2026-11-01, DevTest-Infrastructure#158 (rebase dropped a 71-line fix):** thin, and "filed by the one human in the loop" isn't supported (the fix ran on a `claude/` branch).
- **2026-11-03, hov-stack#384 (400 worktrees):** strong numbers, but "nightly" and "on a timer" aren't in the source (it was a manual `DRY_RUN=0` run), who ran it is unclear, and its lesson (ignored files look clean) overlaps Episode 32. The draft also omits that the live session's worktree was restored from its branch tip.
- **2026-11-05, tyne#514 (dropped commit saved by a timeout):** accurate, and the best of the rest; a near miss, since nothing was published. Kept in reserve.
- **2026-11-06, GitHub 3 to 5 Nov ("resolved, three times"):** the joke no longer holds. The 3 Nov incident now has a full root cause analysis (Git over HTTPS degraded 15:00 to 22:37 UTC, SSH unaffected), so they didn't all close with the same sentence. The Hacker News comment says "about 30% of pushes/pulls", not a third. Superseded by 7 Oct below.

### New candidates looked at

- **GitHub, 7 Oct, writes routed to retired databases** (https://www.githubstatus.com/incidents/djlmxz2zd0j7, HN https://news.ycombinator.com/item?id=49994027): **the strongest one not made.** A replacement machine started with an outdated list that still named retired database servers and sent writes to servers that no longer existed (15:06 to 15:16 UTC). GitHub paused automated maintenance, and at 16:52 "an automated maintenance task" ignored the pause and did it again (to 17:01), a regression from a Puppet update. Up to 26% of Git authentication requests failed. On HN someone asked how GitHub's engineers would push the fix with push down. It isn't written because a `github` episode needs the post-office building and the kit doesn't have one. Possible stamp: "paused maintenance. Maintenance ignored the pause."
- **GitHub, 27 Oct, a cleanup job deleted about 59 million records mid-migration** (https://www.githubstatus.com/incidents/dnslv7xdl4fj): includes "Customer impact began, but was not detected." Same post-office problem; reserve.
- **GitHub, 17 Aug outage, 7 h 47 min, CTO's write-up:** serious infrastructure story (Istio, HAProxy, a VS Code retry bug), no comic arc.
- **CandleViewer#1667 (agent force-pushed main, dropped 3 merged PRs, cherry-picked back the same day):** solid, but the same shape as Episode 35 with less surprise.
- **claude-code#87360 (`git clean -xdff`, about 6,200 files, two paid client deliverables):** real loss with no recovery, but the story turns on an auto-mode classifier gap with no maintainer reply, so it points at an open hole.
- **codex#40995 (`Path()` as a placeholder, `shutil.rmtree(".")` deleted the checkout):** funny, but it's Python deleting the folder, not Git.
- **claude-code#85879 (stash wiped 170 files, then saved them):** who ran `git stash` was never established, so there's no actor.
- **opencode#48468 (PowerShell `-Include` wiped a repo, 132 commits of history lost):** generic delete, partial recovery, overlaps Episode 32.
- **claude-code#104331 (reset destroyed a gitignored `.env`):** about destroyed API keys; too close to the secrets rule, and no recovery.
- **claude-code#103413 (symlinked repo, test's `rm -rf` took the real `.git`, history lost):** plausible reserve, no recovery.
- **personal-ai-agents#363 (checkout in the wrong directory, 20 files, back from Time Machine):** small.
- **rob_box_project#3991 (`rm -rf C*/` expanded to `C:/`, 703,148 files restored):** spectacular, but not Git, and it repeats Episode 32's snapshot rescue. Private names appear in paths.
- **codex#57003 (Unity junction emptied Assets, 4,864 files):** cause not established.
- **developing-today#1862 (macOS temp sweep took nine clones' HEADs):** an OS job, not a Git or agent mistake.
- **zabta.ai (agent deleted a Railway project):** a vendor's marketing blog, and nothing of value was lost.
- **Anthropic's alignment write-up (model opened a PR via a sock puppet):** the events predate the window, and the tone doesn't fit.
- **Also dropped:** cabros-bot#1228 (actor unknown), codex#46022 (600 GB, cause unknown), the "$78,000 Codex agents" HN story (July, and flagged for vote manipulation), and the RMG-Py and fateround malware force-pushes (compromised accounts).

---

## What I could not verify, render or do

- **Analytics:** the site's production build loads Google Tag Manager 1.5 seconds after page load with no hostname check (`src/layouts/Base.astro`, `PROD && !base`). My first local playback checks ran without blocking it, so page views from host 127.0.0.1 for `/incident/<id>/cut/` with these hidden titles probably reached the GA property, up to about 50 page loads on 7 Nov. Nothing public, but filter out hostname 127.0.0.1. Later runs and the still renders blocked Google hosts.
- **`scripts/render-cut.mjs` is broken twice.** In this environment it can't import Playwright from the repo. Separately, its locator `svg.cutscene` now also matches the footer's two cast SVGs, so Playwright's strict mode refuses it; `#cutscene svg.cutscene` fixes that. I rendered with a copy that carries that one-line change and writes to `drafts/episodes/<id>/` instead. The share image wasn't rendered.
- **Voices:** `public/audio/manifest.json` only has voice files for the July episode, so every voiced line in these four plays silent until recorded. The keys are the shot ids.
- **Codex, 11 Aug:** the lead agent's exact wording isn't public (only "scoped cleanup to one file and prohibited broad or recursive deletion"), so the note's ONE FILE. THAT'S ALL. is a paraphrase. Folder size and file counts aren't reported.
- **Karakun:** there's no incident date in the post, so the incident date is the publication date.
- **Benchmark:** what happened when the agent tried to close #64 isn't stated (presumably an error); the episode only shows that #64 doesn't exist. The snapshot commits are timestamped 19 Sep 00:08 UTC; the issue calls it the 18 Sep trial, and the file follows the issue.
- **PACT:** how the rewind was first noticed isn't in the source.
- **The 4 Nov HN comment** (`while ! git push; do sleep 5; done`, https://news.ycombinator.com/item?id=50363320) was confirmed in a summary of the thread; I did not re-read it for this hand-off.
- **Worked example nit:** `2026-07-31-twelve-agents-one-working-directory.md` says "A day later the developer read the cleanup code", but that analysis comment is dated 31 July, the same day as the report. It was a day after the loss itself (30 July UTC). I left it alone.

## Kit gaps (props the stories wanted, not hacked in)

- **Post office building** (the `github` actor, shutters down for an outage): blocks the 7 Oct and 27 Oct GitHub episodes.
- **Bulldozer** (force push): Episodes 34 (replaced), 35 (pushed) and 33's sequel beat. These use a broom, a palm shove or an empty frame instead.
- **Parcel out of the door** (push): Episodes 33 (pushed) and 35.
- **Logbook** (reflog): Episode 35 would show the reflog "recorded nothing".
- **Laptop never draws:** `Cutscene.astro` checks `P.laptop`, but the type puts it at `desk.laptop`, so no laptop renders, in the worked example too.
- **Far window label** is 30 px inside the window; at 0.85 scale it's readable on desktop and marginal on a phone.
- **The note** fits about 11 characters a row and only breaks rows after ". ", so short phrases with full stops are the only way to get two rows.
- **Agent-number effects:** `scribble`, `erase`, `file`, `unfile`, `bonk` (without a gate) and `glance` act on agents 2, 4, 8, 9 and 7 only, from the July episode. That's why Episode 35's note writer is AGENT 2.
