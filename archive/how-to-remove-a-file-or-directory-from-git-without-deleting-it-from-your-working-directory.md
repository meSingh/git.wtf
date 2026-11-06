---
title: >-
  How to remove a file or directory from git without deleting it from your
  working directory?
type: post
published_at: '2019-06-06T00:00:00.000Z'
updated_at: '2023-05-30T18:42:19.000Z'
excerpt: >-
  You have to remove some part of your code from git history in several
  situations. Doing so is very easy if you know these commands.
tags:
  - mistakes-correction
  - git-rm
  - git-reset
feature_image: null
meta_title: null
meta_description: >-
  You have to remove some part of your code from git history in several
  situations. Doing so is very easy if you know these commands.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713161941'
---

<p></p><h4 id="situation-1">Situation 1:</h4><p>If you are not careful while doing a <code>git add</code>, you might end up with files and directories in your staging area that you never wanted.</p><h4 id="situation-2">Situation 2:</h4><p>You committed some files in git that you don't want anymore but still want to remain present on your local system, most commonly configuration files.</p><hr><h4 id="solution">Solution:</h4><p>For both of these situations, you might think of just deleting the file and then recreating it, but git remembers that file, and it will keep displaying it as an unstaged change, which is not good. What you want is that git should forget that file, and you add it to <code>.gitignore</code> so it doesn't get added ever again.</p><pre><code class="language-shell">git rm --cached filename.ext
</code></pre><p>Now we use <code>git rm</code> to remove files from git as well as your file system, but if you pass in the <code>--cached</code> option, it will only remove it from git itself and not from your file system.</p><p>Once you have removed it from git, remember to keep it that way by adding it in your <code>.gitignore</code> file.</p><pre><code class="language-shell">echo filename.ext &gt;&gt; .gitignore
</code></pre>
