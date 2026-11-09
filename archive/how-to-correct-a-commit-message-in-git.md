---
title: 'How to Correct a Commit Message in Git: A Step-by-Step Guide'
type: post
published_at: '2023-12-19T09:32:00.000Z'
updated_at: '2023-12-19T09:32:00.000Z'
excerpt: >-
  As developers, we often find ourselves in a situation where we need to correct
  a commit message after it has already been made.
tags:
  - mistakes-correction
  - learn-git
  - git-push
  - git-commit
  - git-rebase
feature_image: null
meta_title: null
meta_description: >-
  As developers, we often find ourselves in a situation where we need to correct
  a commit message after it has already been made.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613125458'
---

<p>Whether it’s a typo, an incomplete message, or a change in the code's context, editing a commit message is a common requirement. Here’s a guide on how to do it effectively.</p><h2 id="editing-the-most-recent-commit">Editing the Most Recent Commit</h2><p></p><p><strong>The Simple Case - Unpushed Commit</strong>:<br>If you have just committed your changes and haven't pushed them to the remote repository, correcting the commit message is straightforward. You can use the <code>--amend</code> option in Git:</p><pre><code class="language-shell">git commit --amend -m "New commit message"</code></pre><p>This command opens your default text editor, where you can modify the commit message. Save and close the editor to complete the amendment.</p><p></p><p><strong>If You've Already Pushed</strong>:<br>If you've already pushed your commit to a remote repository, you can still use the <code>--amend</code> option, but you'll need to force push the commit:</p><pre><code class="language-shell">git commit --amend -m "New commit message"</code></pre><pre><code class="language-shell">git push --force-with-lease origin your-branch-name</code></pre><p>The <code>--force-with-lease</code> option is safer than <code>--force</code> as it checks if the remote branch has updates you don’t have locally.</p><p></p><hr><p></p><h4 id="editing-an-older-or-specific-commit">Editing an Older or Specific Commit</h4><p>If you need to change a message for a commit that's further back in your history, you will need to use an interactive rebase:</p><ul><li><strong>Start the Interactive Rebase</strong>:<br>First, identify how many commits back you need to go. For example, to edit a commit that's three commits back, use:</li></ul><pre><code class="language-shell">git rebase -i HEAD~3</code></pre><ul><li><strong>Mark the Commit for Rewording</strong>:<br>Your default text editor will open with a list of the last three commits. In front of the commit you want to change, replace <code>pick</code> with <code>reword</code> (or just <code>r</code>).</li><li><strong>Reword the Commit</strong>:<br>Save and close the editor. Git will then reopen the editor for that specific commit. Change the commit message as needed.</li><li><strong>Complete the Rebase</strong>:<br>Save and exit the editor. Git will apply the new commit message and finish the rebase.</li><li><strong>Force Push if Necessary</strong>:<br>If these commits have already been pushed to a remote repository, you will need to force push them as well.</li></ul><pre><code class="language-shell">git push --force-with-lease origin your-branch-name</code></pre><p></p><hr><p></p><h4 id="caution">Caution!</h4><ul><li><strong>Impact on Collaborators</strong>: If you're working in a team, force pushing rewritten history can cause issues for your collaborators. It's crucial to communicate these changes with your team.</li><li><strong>Avoid Rewriting Public History</strong>: As a best practice, avoid rewriting the history of public branches that other people are working on.</li></ul>
