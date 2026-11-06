---
title: How to Force "git pull" to Overwrite Local Files
type: post
published_at: '2023-12-06T06:59:38.000Z'
updated_at: '2023-12-06T06:59:38.000Z'
excerpt: >-
  Sometimes in Git, you might find yourself needing to completely overwrite
  local files with what's on a remote branch. This could be due to various
  reasons li...
tags:
  - learn-git
  - git-pull
  - git-reset
  - git-push
  - git-fetch
  - solving-mistories
feature_image: null
meta_title: null
meta_description: null
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613130140'
---

<p>Sometimes in Git, you might find yourself needing to completely overwrite local files with what's on a remote branch. This could be due to various reasons like needing to reset your project to a clean state, discarding local changes, or if your repository is out of sync with the remote. Here's how to safely force Git to overwrite local files.</p><h4 id="overwriting-local-files">Overwriting Local Files</h4><div class="kg-card kg-callout-card kg-callout-card-yellow"><div class="kg-callout-emoji">❗</div><div class="kg-callout-text"><b><strong style="white-space: pre-wrap;">Warning</strong></b>: This process will discard all your local changes. Any local commits that haven't been pushed will also be lost.</div></div><ul><li><strong>Fetch All Remote Branches</strong>: First, fetch all the updates from the remote repository:</li></ul><pre><code class="language-shell">git fetch --all</code></pre><ul><li><strong>Hard Reset</strong>: Next, reset your local branch to match a remote branch:</li></ul><pre><code class="language-shell">git reset --hard origin/&lt;branch-name&gt;</code></pre><p>Replace <code>&lt;branch-name&gt;</code> with the name of the branch you want to reset to. This command forcefully synchronizes your local branch with the specified remote branch, discarding any divergent local changes.</p>
