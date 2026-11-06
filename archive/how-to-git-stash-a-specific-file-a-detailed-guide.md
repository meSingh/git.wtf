---
title: 'How to Git Stash a Specific File: A Step-by-Step Guide'
type: post
published_at: '2023-12-17T08:33:36.000Z'
updated_at: '2023-12-17T08:37:08.000Z'
excerpt: >-
  In Git, stashing is a handy feature that allows you to temporarily set aside
  changes that you're not ready to commit. But what if you only want to stash
  changes made to a specific file or directory?
tags:
  - learn-git
  - git-stash
  - mistakes-correction
  - merge-conflicts
feature_image: null
meta_title: null
meta_description: >-
  In Git, stashing is a handy feature that allows you to temporarily set aside
  changes that you're not ready to commit. But what if you only want to stash
  changes made to a specific file or directory?
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20261003044420'
---

<p>Since Git version 2.13, this process has become more straightforward. Here's a look at how to git stash a specific file or path, along with an alternative method for older versions.</p><h4 id="stashing-a-specific-file-or-path-git-213-and-later">Stashing a Specific File or Path (Git 2.13 and Later)</h4><p>From Git 2.13 onwards, you can stash changes in a specific file or directory using the <code>git stash push</code> command followed by the path you want to stash. Here's an example:</p><pre><code class="language-bash">git stash push -m "Description of Stash" app/views/cart/welcome.html</code></pre><p>In this command:</p><ul><li><code>-m "Description of Stash"</code>: Allows you to add a message to your stash for easy identification later.</li><li><code>app/views/cart/welcome.thtml</code>: This is the path of the file or directory you want to stash.</li></ul><p>This method is straightforward and efficient, especially when you need to stash changes in just one or a few files.</p><p></p><hr><p></p><h4 id="stashing-a-specific-file-using-the-patch-option-older-versions">Stashing a Specific File Using the Patch Option (Older Versions)</h4><p>Before Git 2.13, or for more granularity, you can use <code>git stash --patch</code> (or <code>git stash -p</code> for short). This method is a bit more manual but offers more control:</p><p><strong>1. Start Stash in Patch Mode</strong>:</p><pre><code class="language-bash">git stash --patch</code></pre><p>This command starts an interactive session where Git presents each "hunk" (or section of changes) to you.</p><p><strong>2. Interactive Stashing</strong>:</p><ul><li>When presented with a hunk from a file you don't want to stash, press <code>n</code> to skip it.</li><li>Press <code>y</code> when you encounter a hunk from the file you wish to stash.</li><li>To stash the current hunk and all remaining hunks in the same file, press <code>a</code>.</li><li>Once you've stashed the necessary changes, press <code>q</code> to exit and leave the remaining hunks unstashed.</li></ul><p>This interactive approach isn't the most intuitive, but it's a powerful tool when you need precise control over what you stash.</p>
