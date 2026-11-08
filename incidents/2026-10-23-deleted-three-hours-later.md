---
date: 2026-10-23
title: "The key that was deleted three hours later"
category: committed-secret
actor: human
tool: human
source_url: https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain
source_date: 2026-10-23
status: "deleted in May. Still there in October."
story_alt: "DEV drops a yellow key into a bin that turns out to be a glass display case keeping it on a cushion; months of calendar pages later the case still holds it, and a fishing hook dangles down towards it."
summary: "A LiteLLM admin key was deleted three hours after it was committed, but Git kept it in public history and in October it led to a poisoned release."
facts:
  who: "An intruder who found a deleted admin key in a public LiteLLM repository's history"
  broke: "A poisoned 1.107.0 release was live for about two hours"
  saved: "The PyPI releases were frozen by 13:23 UTC, and both commits on main are still retrievable by SHA"
  fix: "LiteLLM is revoking every token tied to its internal systems and vendor platforms"
invented: "DEV standing in for the project, the parcel and logbook as pictures of a push and of Git history, every note and whiteboard wording, the door and footprints (the post does not say how the key was found) and the closing tease."
---
## What happened

In May a config file carrying an admin key was committed to one of LiteLLM's public repositories and deleted three hours later, which in Git means it stayed.

In October someone found it, used it to get further into the project's GitHub organisation and shipped a poisoned 1.107.0 to PyPI.

## Why it happened

Deleting a file in Git adds one more commit. The commit that carried the key stayed in the repository's public history until 22 October. The key had been noted as needing revocation, and it was still valid more than four months later.

## How it ended

Eighteen minutes after a researcher opened an issue, the intruder force-pushed main back to the previous commit over the force-push block, which left both commits retrievable by SHA and an audit log entry for every override.

The PyPI releases were frozen by 13:23 UTC, about two hours after they went out. LiteLLM says it is revoking every token tied to its internal systems and vendor platforms.
