---
title: How to find the commit that broke something after a merge in Git?
type: post
published_at: '2019-06-12T00:00:00.000Z'
updated_at: '2023-06-03T19:34:14.000Z'
excerpt: >-
  Tracking the commit that introduced a bug after a big merge can be
  time-consuming. Luckily git offers a great binary search facility in the form
  of `git-bisect.`
tags:
  - accidents-recovery
  - git-merge
  - git-bisect
feature_image: null
meta_title: null
meta_description: >-
  Tracking the commit that introduced a bug after a big merge can be
  time-consuming. Luckily git offers a great binary search facility in the form
  of `git-bisect.`
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613122417'
---

<p>Tracking the commit that introduced a bug after a big merge can be time-consuming. Luckily git offers a great binary search facility in the form of <code>git-bisect</code>. First, you have to perform the initial setup:</p><pre><code class="language-shell"> git bisect start         # starts the bisecting session
 git bisect bad           # marks the current revision as bad
 git bisect good revision # marks the last known good revision
</code></pre><p>After this, git will automatically checkout a revision halfway between the known “good” and “bad” versions; you can now rerun your specs and mark the commit as “good” or “bad” accordingly.</p><pre><code class="language-shell">git bisect good # or git bisec bad
</code></pre><p>This process continues until you get to the commit that introduced the bug.</p><p></p><!--kg-card-begin: html--><a href="https://dev.to/citizen428/10-common-git-problems-and-how-to-fix-them-234o?ref=git.wtf#8-find-the-commit-that-broke-something-after-a-merge" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Dev.to
</a><!--kg-card-end: html-->
