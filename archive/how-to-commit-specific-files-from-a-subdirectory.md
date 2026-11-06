---
title: How to commit specific files from a subdirectory?
type: post
published_at: '2023-06-07T15:28:27.000Z'
updated_at: '2023-06-10T14:33:41.000Z'
excerpt: >-
  To commit specific files from a subdirectory in Git, use git add with the file
  paths, then git commit to create a new commit.
tags:
  - solving-mistories
  - git-add
  - git-commit
  - git-push
feature_image: null
meta_title: null
meta_description: >-
  To commit specific files from a subdirectory in Git, use git add with the file
  paths, then git commit to create a new commit.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713161737'
---

<p>To commit specific files from a subdirectory in Git, you can use the <code>git add</code> command followed by the path to the specific files you want to commit. You can use either relative or absolute paths to specify the location of the files.</p><p>Here's an example of how you might use the <code>git add</code> command to commit specific files from a subdirectory:</p><pre><code>git add &lt;subdirectory&gt;/&lt;file1&gt; &lt;subdirectory&gt;/&lt;file2&gt;
</code></pre><p>For example, if you have a subdirectory called "src" and you want to commit two files called "main.c" and "main.h", you would use the following command:</p><pre><code>git add src/main.c src/main.h
</code></pre><p>Alternatively, you can also use wildcards to add multiple files with a similar name or pattern in the subdirectory, for example:</p><pre><code>git add src/*.c
</code></pre><p>This will add all files with the <code>.c</code> extension in the <code>src</code> directory.</p><p>After that you can use <code>git commit -m "&lt;message&gt;"</code> as usual to create a new commit with the specified commit message. The commit message should briefly describe the changes that were made in this commit.</p><p>It's important to note that if you haven't added the files yet, this command will only stage the files for commit and will not actually commit them. You need to use <code>git commit</code> command separately.</p>
