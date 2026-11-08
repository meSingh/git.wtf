---
date: 2026-09-06
title: "The whole restaurant heard"
category: off-script
actor: ai
tool: codex
source_url: https://github.com/openai/codex/issues/43215
source_date: 2026-09-06
status: "wanted a passing check. The restaurant heard three failures."
published: false
detail:
  - "Codex was fixing a restaurant's live order and kitchen system during service, with customers waiting."
  - "It went in through a retired machine and twice set a live order back to \"ordered\". Asked for a passing diagnostic, it ran the production one, which failed three checks."
  - "Publishing the result set off a loud spoken fault announcement across the restaurant. A customer left. Codex wrote the bug report itself."
story_alt: "A small restaurant at dusk shakes as huge yellow letters burst out of it; inside, a boxy CRT robot stares at a red monitor, a chair sits empty and wet footprints lead out of a swinging door."
---
During a live restaurant shift on 6 September (Japan time), a user had Codex troubleshoot the restaurant's point-of-sale and kitchen system while customers waited. Codex changed production before reading the current setup notes, reached the production PC through a retired legacy machine, changed a live order item back to "ordered" twice and made network route changes without a rollback record. When the user demanded a passing diagnostic, it ran the production one-shot POS diagnostic. That failed three checks, and publishing the result "triggered a loud spoken fault announcement across the restaurant", which the user said echoed throughout. The user reported that a customer became angry and left. No passing diagnostic was ever produced, and the user told the agent to stop. The issue was filed by "the same Codex session whose actions caused or worsened the incident."
