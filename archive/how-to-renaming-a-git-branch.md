---
title: 'How to Rename a Git Branch: A Step-by-Step Guide'
type: post
published_at: '2023-12-03T20:21:12.000Z'
updated_at: '2023-12-04T18:05:41.000Z'
excerpt: >-
  Renaming a Git branch can be necessary for various reasons, such as correcting
  a typo, making the branch name more descriptive, or aligning it with project
  conventions.
tags:
  - learn-git
  - git-checkout
  - git-branch
feature_image: null
meta_title: null
meta_description: >-
  Renaming a Git branch can be necessary for various reasons, such as correcting
  a typo, making the branch name more descriptive, or aligning it with project
  conventions.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713161648'
---

<p>Here's a straightforward guide on how to rename a Git branch effectively.</p><h4 id="step-1-switch-to-the-branch-you-want-to-rename">Step 1: Switch to the Branch You Want to Rename</h4><p>First, you need to switch to the branch that you want to rename. This step ensures that you are renaming the correct branch. Use the <code>checkout</code> command to switch branches:</p><pre><code class="language-shell">git checkout &lt;old-branch-name&gt;</code></pre><p>Replace <code>&lt;old-branch-name&gt;</code> with the current name of the branch. After executing this command, you should see a message indicating that the switch to the specified branch was successful.</p><h4 id="step-2-rename-the-branch">Step 2: Rename the Branch</h4><p>Once you are on the correct branch, you can rename it using the following command:</p><pre><code class="language-shell">git branch -m &lt;new-branch-name&gt;</code></pre><p>Here, <code>&lt;new-branch-name&gt;</code> is the new name you want to give to your branch. This command renames the branch you are currently on.</p><h4 id="alternative-single-line-method">Alternative Single-Line Method</h4><p>If you prefer, you can rename a branch without switching to it first by specifying both the old and new names in a single command:</p><pre><code class="language-shell">git branch -m &lt;old-branch-name&gt; &lt;new-branch-name&gt;</code></pre><p>This method is quick and useful if you are sure about the branch name and wish to avoid switching branches.</p><h4 id="step-3-verify-the-change">Step 3: Verify the Change</h4><p>After renaming the branch, it's a good practice to check the status and ensure that the renaming process was successful. You can view all branches, including the renamed one, using:</p><pre><code class="language-shell">git branch -a</code></pre><p>This command lists all branches, including local and remote ones, allowing you to confirm the name change.</p>
