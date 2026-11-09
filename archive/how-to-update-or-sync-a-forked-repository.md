---
title: How to Update or Sync a Forked Repository
type: post
published_at: '2023-12-06T07:00:37.000Z'
updated_at: '2023-12-07T11:52:59.000Z'
excerpt: >-
  When you fork a repository on platforms like GitHub, you create a personal
  copy of someone else's project. This is useful for making your own changes
  without...
tags:
  - learn-git
  - fork
  - git-remote
  - git-fetch
  - git-checkout
  - git-merge
  - git-pull
feature_image: null
meta_title: null
meta_description: null
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713151208'
---

<p>When you fork a repository on platforms like GitHub, you create a personal copy of someone else's project. This is useful for making your own changes without affecting the original project. However, over time, the original repository (often called the "upstream" repository) may receive updates that your fork doesn't have. Keeping your fork in sync with the upstream repository is an important step to ensure you're working with the latest version. Here's how to do it.</p><h4 id="setting-up-the-upstream-repository">Setting Up the Upstream Repository</h4><ul><li><strong>Navigate to Your Cloned Repository</strong>: Open your terminal and go to your local copy of the forked repository.</li><li><strong>Link to the Upstream Repository</strong>: By default, your local repository isn't connected to the original upstream repository. You need to add a new remote that points to the original repository:</li></ul><pre><code class="language-bash">git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git</code></pre><p>Replace <code>ORIGINAL_OWNER</code> and <code>ORIGINAL_REPOSITORY</code> with the relevant information.</p><ul><li><strong>Verify the New Remote</strong>: To ensure that the upstream repository was added correctly, list all configured remotes:</li></ul><pre><code class="language-bash">git remote -v</code></pre><p></p><h4 id="syncing-your-fork">Syncing Your Fork</h4><ul><li><strong>Fetch from the Upstream Repository</strong>: First, fetch the updates from the upstream repository:</li></ul><pre><code class="language-bash">git fetch upstream</code></pre><ul><li><strong>Switch to Your Local Main Branch</strong>: Before merging the changes, switch to your local main branch (or the branch you wish to update):</li></ul><pre><code class="language-bash">git checkout main</code></pre><ul><li><strong>Merge Upstream Changes</strong>: Merge the changes from the upstream main branch into your local main branch:</li></ul><pre><code class="language-bash">git merge upstream/main</code></pre><h4 id="regularly-syncing-your-fork">Regularly Syncing Your Fork</h4><p>After the initial setup, syncing your main branch with the upstream repository is simple. Just run the following command whenever you need to update your fork:</p><pre><code class="language-bash">git pull upstream main</code></pre>
