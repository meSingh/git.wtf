---
title: How to squash the last X commits together in git?
type: post
published_at: '2016-10-11T00:00:00.000Z'
updated_at: '2023-05-30T04:28:05.000Z'
excerpt: >-
  Initially, when I started working on git, I was terrified of squashing
  commits, I always feared that I would do it wrong and will lose some code, but
  it's very simple once you understand the underlying logic.
tags:
  - solving-mistories
  - git-reset
  - git-commit
feature_image: null
meta_title: null
meta_description: >-
  Initially, when I started working on git, I was terrified of squashing
  commits, I always feared that I would do it wrong and will lose some code, but
  it's very simple once you understand the underlying logic.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613121819'
---

<p>In this example, we'll squash the last three commits. If you want to write the new commit message from scratch, this suffices:</p><pre><code class="language-bash">git reset --soft HEAD~3 &amp;&amp;
git commit
</code></pre><p>If you want to start editing the new commit message with a concatenation of the existing commit messages, then you need to extract those messages and pass them to git commit:</p><pre><code class="language-bash">git reset --soft HEAD~3 &amp;&amp;
git commit --edit -m"$(git log --format=%B --reverse HEAD..HEAD@{1})"
</code></pre><p>Both methods squash the last three commits into a single new commit similarly. The soft reset re-points HEAD to the last commit you do not want to squash. Neither the index nor the working tree is touched by the soft reset, leaving the index in the desired state for your new commit (i.e., it already has all the changes from the commits you are about to "throw away").</p><p></p><!--kg-card-begin: html--><a href="http://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git/5190323?ref=git.wtf#5190323" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: StackOverflow
</a><!--kg-card-end: html-->
