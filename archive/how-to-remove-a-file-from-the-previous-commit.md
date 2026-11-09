---
title: How to remove a file from the previous commit?
type: post
published_at: '2019-06-17T00:00:00.000Z'
updated_at: '2023-06-03T19:55:08.000Z'
excerpt: >-
  Sometimes, you would want to remove a specific file or part of the code from
  your last commit.
tags:
  - mistakes-correction
  - git-commit
feature_image: null
meta_title: null
meta_description: >-
  Sometimes, you would want to remove a specific file or part of the code from
  your last commit.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260713160927'
---

<p>Sometimes, you would want to remove a specific file or part of the code from your last commit. To do it, do the following:</p><pre><code class="language-shell">git checkout HEAD^ myfile # this revert the file to the last commit.
git add myfile
git commit --amend --no-edit
</code></pre><p>In case you don't have a history or said: "It was a new file." You need to remove it from the account altogether.</p><pre><code class="language-shell">git rm --cached myfile
git commit --amend --no-edit
</code></pre><p>This is particularly useful when you have an open patch and have committed an unnecessary file and need to force push to update the patch on a remote. The <code>--no-edit</code> option is used to keep the existing commit message.</p><p></p><!--kg-card-begin: html--><a href="https://github.com/k88hudson/git-flight-rules?ref=git.wtf#i-want-to-remove-a-file-from-the-previous-commit" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Github (k88hudson)
</a><!--kg-card-end: html-->
