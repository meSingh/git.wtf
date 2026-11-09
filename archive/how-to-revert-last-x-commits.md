---
title: How to revert the last X commits?
type: post
published_at: '2016-09-29T00:00:00.000Z'
updated_at: '2023-05-30T04:09:24.000Z'
excerpt: >-
  The simplest way of revering commits is to reset your head to the last commit
  you want and just discard the changes, here is how you can do it.
tags:
  - mistakes-correction
  - git-reset
  - git-reflog
feature_image: null
meta_title: null
meta_description: >-
  The simplest way of revering commits is to reset your head to the last commit
  you want and just discard the changes, here is how you can do it.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613115015'
---

<pre><code class="language-bash">git reflog
# you will see a list of every thing you've done in git, across all branches!
# each one has an index HEAD@{index}
# find the one before you broke everything

git reset HEAD@{index}
# magic time machine
</code></pre><p>You can use this to get back stuff you accidentally deleted or remove some things you tried that broke the repo.</p><p></p><!--kg-card-begin: html--><a href="http://ohshitgit.com/?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: OhShitGit
</a><!--kg-card-end: html-->
