---
title: What did I just commit?
type: post
published_at: '2019-06-17T00:00:00.000Z'
updated_at: '2023-06-03T20:23:12.000Z'
excerpt: >-
  So imagine that you blindly committed some changes with `git commit -a`, and
  you are not satisfied with the particular content of the commit you just
  created.
tags:
  - solving-mistories
  - git-commit
  - merge-conflicts
feature_image: null
meta_title: null
meta_description: >-
  So imagine that you blindly committed some changes with `git commit -a`, and
  you are not satisfied with the particular content of the commit you just
  created.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260713162022'
---

<p>So, imagine that you just mindlessly committed changes &nbsp;<code>git commit -a</code> and are not satisfied with the particular content of the commit you created. You can now show the latest commit on your current HEAD with the following:</p><pre><code class="language-shell">git show
</code></pre><p>or</p><pre><code class="language-shell">git log -n1 -p
</code></pre><p>If you want to see a file at a specific commit, you can also do this (where <code>&lt;commitid&gt;</code> is the commit you're interested in):</p><pre><code class="language-shell">git show &lt;commitid&gt;:filename
</code></pre>
