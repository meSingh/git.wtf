---
title: >-
  How to Undo 'Git Add': Reverting Staged Files Before Commit : A Step-by-Step
  Guide
type: post
published_at: '2023-12-04T14:36:45.000Z'
updated_at: '2023-12-17T08:38:10.000Z'
excerpt: >-
  In Git, the git add command stages changes for a commit, but if you mistakenly
  add files or reconsider their inclusion, Git offers a straightforward method
  to unstage these files.
tags:
  - learn-git
  - git-add
  - git-reset
  - mistakes-correction
feature_image: null
meta_title: null
meta_description: >-
  In Git, the git add command stages changes for a commit, but if you mistakenly
  add files or reconsider their inclusion, Git offers a straightforward method
  to unstage these files.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613122215'
---

<p></p><h4 id="undoing-git-add-for-all-files">Undoing <code>git add</code> for All Files</h4><p>If you want to unstage all files you've added, you can use one of the following commands:</p><ul><li>Using a basic <code>git reset</code> without any arguments:</li></ul><pre><code class="language-shell">git reset</code></pre><ul><li>Specifying <code>HEAD</code> with the reset, which refers to the current commit:</li></ul><pre><code class="language-shell">git reset HEAD</code></pre><ul><li>Using <code>git reset</code> with no arguments, which implicitly targets <code>HEAD</code>:</li></ul><pre><code class="language-shell">git reset </code></pre><p>Any of these commands will unstage all the files you've added, but won't alter the actual changes made to the files.</p><h4 id="undoing-git-add-for-a-specific-file">Undoing <code>git add</code> for a Specific File</h4><p>If you only want to unstage a specific file, you can do so by including the file's name in the reset command:</p><ul><li>Basic reset with the filename:</li></ul><pre><code class="language-shell">git reset &lt;filename&gt;</code></pre><ul><li>Using <code>HEAD</code> with the filename:</li></ul><pre><code class="language-shell">git reset HEAD &lt;filename&gt;</code></pre><ul><li>Using <code>@</code> (a shortcut for <code>HEAD</code> since Git v1.8.5) with the filename:</li></ul><pre><code class="language-shell">git reset @ &lt;filename&gt;</code></pre><p>Replace <code>&lt;filename&gt;</code> with the actual name of the file you want to unstage.</p><h4 id="understanding-the-impact">Understanding the Impact</h4><p>Using the <code>git reset</code> command in this way only affects the staging area and doesn't change the contents of your files. It's a safe way to undo the staging before you commit, allowing you to review and reselect the files for your commit.</p><h4 id="note-on-head">Note on <code>HEAD</code></h4><p>In Git, <code>HEAD</code> is a reference to the last commit of the current branch. When you use <code>git reset</code>, you’re essentially telling Git to make the staging area look like the last commit (<code>HEAD</code>), without altering the working directory.</p>
