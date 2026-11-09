---
title: How to discard local modifications in git?
type: post
published_at: '2019-06-04T00:00:00.000Z'
updated_at: '2023-05-30T11:47:06.000Z'
excerpt: >-
  Everybody has their own way of writing code, and there are times when you try
  out a few ways of creating a functionality or fixing that nasty bug, which is
  not such a good way of doing it. If you want to discard your current changes,
  you can do it easily by checking out the modified files.
tags:
  - mistakes-correction
  - git-checkout
  - git-reset
feature_image: null
meta_title: null
meta_description: >-
  Everybody has their own way of writing code, and there are times when you try
  out a few ways of creating a functionality or fixing that nasty bug, which is
  not such a good way of doing it. If you want to discard your current changes,
  you can do it easily by checking out the modified files.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613122618'
---

<p>Everybody has their own way of writing code, and there are times when you try out a few ways of creating a functionality or fixing that nasty bug, which is not such a good way of doing it. If you want to discard your current changes, you can do it easily by checking out the modified files.</p><pre><code class="language-shell">git checkout modified-file.ext
</code></pre><p>That's all you need...</p><p>...</p><p>...</p><p>But wait! What if you want to discard more than one file?</p><pre><code class="language-shell">git checkout modified-file.ext another-modified-file.ext one-more-modified-file.ext
</code></pre><p>You can add as many files as you want and not just files. It works with complete directories too.</p><pre><code class="language-shell">git checkout ./modified-directory
</code></pre><p>That's everything in <code>modified-directory</code>.</p><p>...</p><p>...</p><p>But wait! What if you have too many files to discard, and it's taking forever? Do it one by one, or do you want to dump everything?</p><pre><code class="language-shell">git checkout .
</code></pre><p>Yup, a dot... that's all you need.</p><blockquote>Note: this method helps you discard any modified files from your working directory, if you have created any new ones, they needed to be removed the good old fashioned way or <code>rm</code>.</blockquote>
