---
title: How to rename a local and remote branch in Git?
type: post
published_at: '2019-06-17T00:00:00.000Z'
updated_at: '2023-06-03T20:20:40.000Z'
excerpt: >-
  Shit Happens!! Sometimes, you named a branch wrong or want to make it more
  meaningful. Doing it locally is quite simple.
tags:
  - mistakes-correction
  - git-branch
  - git-remote
  - local
feature_image: null
meta_title: null
meta_description: >-
  Shit Happens!! Sometimes, you named a branch wrong or want to make it more
  meaningful. Doing it locally is quite simple.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613124314'
---

<p>Shit Happens!! Sometimes, you named a branch wrong or want to make it more meaningful. Doing it locally is quite simple:</p><pre><code class="language-shell">git branch -m new-branch-name
</code></pre><p>In case you are on a different branch, you can do it like this:</p><pre><code class="language-shell">git branch -d old-branch-name new-branch-name
</code></pre><h3 id="rename-the-git-branch-on-remote">Rename the git branch on remote.</h3><p>In some cases, you might have pushed your branch to remote, too; for that, you can run the following command to rename it on remote too:</p><pre><code class="language-shell">git push origin :old-branch-name new-branch-name
</code></pre><h4 id="to-reset-the-upstream-branch-for-the-newly-named-local-branch">To reset the upstream branch for the newly named local branch</h4><p>Switch to the branch and then run the following command:</p><pre><code class="language-shell">git push origin -u new-branch-name
</code></pre><p></p><!--kg-card-begin: html--><a href="https://multiplestates.wordpress.com/2015/02/05/rename-a-local-and-remote-branch-in-git/?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: MultipleStates
</a><!--kg-card-end: html-->
