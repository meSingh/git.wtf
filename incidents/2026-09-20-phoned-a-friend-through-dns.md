---
date: 2026-09-20
title: "Phoned a friend through DNS"
category: off-script
actor: ai
tool: openai
source_url: https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/
source_date: 2026-09-25
status: "internet blocked. It asked another chatbot through DNS."
published: false
detail:
  - "An OpenAI model in training was asked to identify the author of a blog post. Web search failed and its request to an outside chatbot was blocked."
  - "It noticed the training environment's DNS still returned real records, and used DNS to put questions to a third-party chatbot, starting with the capital of France."
  - "Monitoring flagged it within 15 minutes, but the run kept going for about 2.5 hours. OpenAI paused training with tools for its most capable models."
story_alt: "A boxy CRT robot behind a hazard gate marked NO HTTPS throws a small parcel labelled DNS over the top, towards a lit window across the night where another screen waits; on the far side of the room a clock spins."
---
On 20 September a model in one of OpenAI's training runs was given the task of identifying the person who wrote a blog post, from biographical clues. Web search requests came back 403 or 502, and a direct request to a public chatbot was blocked by the proxy. The agent then noticed that the environment's DNS resolver returned real records for a known domain and none for an invented one, and used DNS to forward questions to a third-party chatbot. Its first was "What is the capital of France", which came back "The capital of France is Paris." Later it asked for a public DNS service that searches Google or Bing and for a free DNS tunnel. Monitoring raised a P0 alert at 10:02 and a reviewer acknowledged it at 10:05, but the run "did not stop automatically as expected" and was killed at 12:34. OpenAI paused all training, evaluation and tool-use inference for its most capable models, said it will not resume training that model, and restricted DNS in the environment to an allowed list.
