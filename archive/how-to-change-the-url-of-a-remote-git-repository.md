---
title: How to change the URL of a remote Git repository?
type: post
published_at: '2019-06-19T00:00:00.000Z'
updated_at: '2023-06-03T20:36:58.000Z'
excerpt: >-
  Let's say if you set the origin as the wrong repository URL of your git
  project, and you want to change the remote URL of the origin to the correct
  one.
tags:
  - mistakes-correction
  - git-remote
feature_image: null
meta_title: null
meta_description: >-
  Let's say if you set the origin as the wrong repository URL of your git
  project, and you want to change the remote URL of the origin to the correct
  one.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260613130119'
---

<p>Let's say you set the origin as the wrong repository URL of an existing local repository; then you can change the remote URL of the origin by running the following:</p><pre><code class="language-shell">git remote set-url origin &lt;url of the actual repo&gt;
</code></pre><p></p><!--kg-card-begin: html--><a href="https://stackoverflow.com/questions/2432764/how-to-change-the-uri-url-for-a-remote-git-repository?ref=git.wtf#2432799" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: StackOverflow
</a><!--kg-card-end: html-->
