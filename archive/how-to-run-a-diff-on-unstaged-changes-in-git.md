---
title: How to run a diff on unstaged changes in git?
type: post
published_at: '2016-09-29T00:00:00.000Z'
updated_at: '2023-05-30T04:14:25.000Z'
excerpt: >-
  Doing a diff is very simple and easy, just remember the following command, and
  you are set for life.
tags:
  - solving-mistories
  - git-diff
  - git-checkout
  - git-stash
feature_image: null
meta_title: null
meta_description: >-
  Doing a diff is very simple and easy, just remember the following command, and
  you are set for life.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260314030901'
---

<pre><code class="language-bash">git diff --staged
</code></pre><p>Git won't do a diff of files that have been added to your staging area without this flag. File under ¯(ツ)/¯ (yes, this is a feature, not a bug, but it's baffling and non-obvious the first time it happens to you!)</p><p></p><!--kg-card-begin: html--><a href="http://ohshitgit.com/?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: OhShitGit
</a><!--kg-card-end: html-->
