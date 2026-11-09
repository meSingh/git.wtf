---
title: How to check for conflict markers in git?
type: post
published_at: '2019-06-17T00:00:00.000Z'
updated_at: '2023-06-03T19:44:00.000Z'
excerpt: >-
  While working with teams, there is a good chance of screw-ups. There can be
  any mistake. One of the most common is leaving conflict markers somewhere.
  Finding these markers can be tedious if you have a large repository.
tags:
  - accidents-recovery
  - git-merge
  - merge-conflicts
feature_image: null
meta_title: null
meta_description: >-
  While working with teams, there is a good chance of screw-ups. There can be
  any mistake. One of the most common is leaving conflict markers somewhere.
  Finding these markers can be tedious if you have a large repository.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260713153324'
---

<p>While working with teams, there is a good chance of screw-ups. There can be any mistake. One of the most common is leaving conflict markers somewhere. Finding these markers can be tedious if you have a large repository.</p><p>Using the following command, you can check for these markers with file names &amp; line numbers.</p><pre><code class="language-shell">git diff --check
</code></pre><p>You can also use this command with your CI/CD setup to check for conflicts in your workflow, as it exits with non-zero status if it finds any markers.</p><p></p><!--kg-card-begin: html--><a href="https://twitter.com/ohshitgit/status/808497638681284608?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Twitter (ohshitgit)
</a><!--kg-card-end: html-->
