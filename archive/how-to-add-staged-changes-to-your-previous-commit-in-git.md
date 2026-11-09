---
title: How to add staged changes to your previous commit in Git?
type: post
published_at: '2019-06-22T00:00:00.000Z'
updated_at: '2023-06-04T10:06:09.000Z'
excerpt: >-
  Forgot to add some files or changes in your last commit? Or remember that last
  thing you needed to do after you have already committed? We have a solution!
tags:
  - solving-mistories
  - git-commit
  - git-add
feature_image: null
meta_title: null
meta_description: >-
  Forgot to add some files or changes in your last commit? Or remember that last
  thing you needed to do after you have already committed? We have a solution!
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713145546'
---

<p>To add staged changes to the previous commit, use the following command:</p><pre><code class="language-shell">git commit --amend
</code></pre><p>If you don't want to modify the commit message, you can instruct git to reuse that commit message:</p><pre><code class="language-shell">git commit --amend -C HEAD
</code></pre><p></p><!--kg-card-begin: html--><a href="https://github.com/k88hudson/git-flight-rules?ref=git.wtf#i-need-to-add-staged-changes-to-the-previous-commit" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Github (k88hudson)
</a><!--kg-card-end: html-->
