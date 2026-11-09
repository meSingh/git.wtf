---
title: How to get your changes back after an accidental hard reset in Git?
type: post
published_at: '2019-06-19T00:00:00.000Z'
updated_at: '2023-06-03T20:39:43.000Z'
excerpt: >-
  If you made `git reset --hard` by mistake, possibilities are you can still get
  your commit back, as git holds a log of everything for a few days.
tags:
  - accidents-recovery
  - git-reset
  - git-reflog
  - git-commit
feature_image: null
meta_title: null
meta_description: >-
  If you made `git reset --hard` by mistake, possibilities are you can still get
  your commit back, as git holds a log of everything for a few days.
canonical_url: null
authors:
  - Sahil Bhatacharya
source: wayback
wayback_ts: '20260713145826'
---

<p>If you made <code>git reset --hard</code> by mistake, possibilities are you can still get your commit back, as git holds a log of everything for a few days. This is only valid if your work is backed up, i.e., by committed or stashed. As <code>git reset --hard</code> removes uncommitted changes, so be careful before going into trouble.</p><p>The much more reliable choice is to run the following command.</p><pre><code class="language-shell">git reset --keep
</code></pre><p>Alternatively, you can check the list of your past commits and choose the SHA of the commit you want:</p><pre><code class="language-shell">git reflog
</code></pre><p>Now, run the following command to get your changes back:</p><pre><code class="language-shell">git reset --hard SHA1234
</code></pre><p></p><!--kg-card-begin: html--><a href="https://github.com/k88hudson/git-flight-rules?ref=git.wtf#i-accidentally-did-a-hard-reset-and-i-want-my-changes-back" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Github (k88hudson)
</a><!--kg-card-end: html-->
