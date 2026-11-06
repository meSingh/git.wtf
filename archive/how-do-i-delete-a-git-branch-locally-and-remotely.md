---
title: How do I delete a git branch locally and remotely?
type: post
published_at: '2019-06-09T00:00:00.000Z'
updated_at: '2023-06-03T19:30:19.000Z'
excerpt: >-
  Git branches are an essential part of your daily development process, but once
  you or your team have finished with a feature and merged it into your remote’s
  main branch, you would want to delete that branch from your local repo and
  your remote.
tags:
  - solving-mistories
  - git-remote
  - git-branch
  - git-push
  - local
feature_image: null
meta_title: null
meta_description: >-
  Git branches are an essential part of your daily development process, but once
  you or your team have finished with a feature and merged it into your remote’s
  main branch, you would want to delete that branch from your local repo and
  your remote.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260713162153'
---

<p>Git branches are an essential part of your daily development process, but once you or your team have finished with a feature and merged it into your remote's master branch, you would want to delete it from the local and as your remote. You can do it in two ways:</p><pre><code class="language-shell">git push --delete &lt;remote_name&gt; &lt;branch_name&gt;
</code></pre><p>To delete a local branch, use the following:</p><pre><code class="language-shell">git branch -d &lt;branch_name&gt;
</code></pre><p><strong>Note:</strong></p><ul><li><code>-d</code> option for <code>git branch</code> the command is an alias of <code>--delete</code> flag, which deletes the branch if it has already merged in its upstream branch.</li><li><code>-D</code> is also an option <code>--delete</code> flag, which deletes the branch "regardless of its merged status."</li></ul><p></p><!--kg-card-begin: html--><a href="https://stackoverflow.com/questions/2003505/how-do-i-delete-a-git-branch-locally-and-remotely/2003515?ref=git.wtf#2003515" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: StackOverflow
</a><!--kg-card-end: html-->
