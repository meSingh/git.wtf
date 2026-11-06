---
title: How to revert pushed commit from the repo?
type: post
published_at: '2019-06-12T00:00:00.000Z'
updated_at: '2023-06-03T19:37:46.000Z'
excerpt: >-
  Despite all the fixes you try, faulty commits occasionally make it into the
  central repository. Still, this is no reason to despair, since git offers an
  easy way to revert single or multiple commits.
tags:
  - mistakes-correction
  - git-revert
  - git-commit
  - git-reset
feature_image: null
meta_title: null
meta_description: >-
  Despite all the fixes you try, faulty commits occasionally make it into the
  central repository. Still, this is no reason to despair, since git offers an
  easy way to revert single or multiple commits.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713153722'
---

<p>Despite all the fixes you try, faulty commits occasionally make it into the central repository. Still, this is no reason to despair since git offers an easy way to revert single or multiple commits:</p><h4 id="revert-the-commit-with-the-specified-id">Revert the commit with the specified id</h4><pre><code class="language-shell">git revert c761f5c
</code></pre><h4 id="revert-the-second-to-last-commit">Revert the second to last commit.</h4><pre><code class="language-shell">git revert HEAD^
</code></pre><h4 id="revert-a-whole-range-of-commits">Revert a whole range of commits.</h4><pre><code class="language-shell">git revert develop~4..develop~2
</code></pre><p>In case you don’t want to create additional revert commits but only apply the necessary changes to your working tree, you can use the <code>--no-commit/-n</code> option.</p><pre><code class="language-shell"># undo the last commit, but don't create a revert commit
git revert -n HEAD
</code></pre><p>The manual page at <code>man 1 git-revert</code> list further options and provides some additional examples.</p><p></p><!--kg-card-begin: html--><a href="https://dev.to/citizen428/10-common-git-problems-and-how-to-fix-them-234o?ref=git.wtf#6-reverting-pushed-commits" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Dev.to
</a><!--kg-card-end: html-->
