---
title: How to remove staged changes from git?
type: post
published_at: '2017-01-21T00:00:00.000Z'
updated_at: '2023-05-30T07:14:10.000Z'
excerpt: >-
  To remove your staged changes or to undo your last `git add` command, you can
  use `git reset`. Running the below command will remove all files from your
  staging area
tags:
  - solving-mistories
  - git-reset
feature_image: null
meta_title: null
meta_description: >-
  To remove your staged changes or to undo your last `git add` command, you can
  use `git reset`. Running the below command will remove all files from your
  staging area
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613125748'
---

<pre><code class="language-bash">git reset
</code></pre><p>In case you want to remove only a specific file(s), then you can mention the name of the file(s) like this:</p><pre><code class="language-bash"># To remove a single file
git reset filename.ext

# You can also remove bunch of files using simple rejex expressions
git reset content/*.png
</code></pre><!--kg-card-begin: html--><a href="http://data.agaric.com/undo-git-add-remove-files-staged-git-commit?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Agaric
</a><!--kg-card-end: html-->
