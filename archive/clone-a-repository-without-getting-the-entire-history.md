---
title: Clone a repository without getting the entire history
type: post
published_at: '2020-03-03T00:00:00.000Z'
updated_at: '2023-06-06T21:27:41.000Z'
excerpt: >-
  Git has a feature that we call Shallow Clone; this allows us to make a clone
  of a repository without taking in the entire history of commits/logs.
tags:
  - improving-workflow
  - git-pull
  - git-clone
feature_image: null
meta_title: null
meta_description: >-
  Git has a feature that we call Shallow Clone; this allows us to make a clone
  of a repository without taking in the entire history of commits/logs.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613122521'
---

<p>Git has a feature that we call Shallow Clone; this allows us to make a clone of a repository without taking in the entire history of commits/logs. This helps in a couple of ways; first, it decreases the size of the complete repository quite a bit, and secondly, because of reduced size, it also makes the cloning faster, and you can get started working on it more quickly. To do this, clone using the <code>--depth</code> option when cloning, like this:</p><pre><code class="language-sh">git clone &lt;repository URL&gt; --depth 1
</code></pre><p>The <code>--depth</code> the parameter allows you to specify how deep you want to go. So you can have some layers of commits by increasing the depth count:</p><pre><code class="language-sh">git clone &lt;repository URL&gt; --depth 3
</code></pre><p>Now doing this has its perks, but at the same time, as you lose all history, you can not see who committed what, and the original authors lose credits (in a way) for their work. I would recommend doing this in cases when you have a large repo to clone and losing history does not affect you in any way, like downloading a prebuilt app for personal purposes.</p><p></p><!--kg-card-begin: html--><a href="http://firstaidgit.io/?ref=git.wtf#/" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: FirstAidGit
</a><!--kg-card-end: html-->
