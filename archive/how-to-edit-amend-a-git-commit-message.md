---
title: 'How to Edit (Amend) a Git Commit Message: A Step-by-Step Guide'
type: post
published_at: '2023-12-04T13:29:58.000Z'
updated_at: '2023-12-04T13:29:58.000Z'
excerpt: >-
  Amending a commit message in Git is often necessary for clarity or to correct
  errors, and while it's a straightforward process, it's crucial to be aware of
  the implications, particularly when the commit has been pushed to a remote
  repository like GitHub.
tags:
  - learn-git
  - git-commit
  - git-push
  - mistakes-correction
feature_image: null
meta_title: null
meta_description: >-
  Amending a commit message in Git is often necessary for clarity or to correct
  errors, and while it's a straightforward process, it's crucial to be aware of
  the implications, particularly when the commit has been pushed to a remote
  repository like GitHub.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713152017'
---

<p></p><h4 id="editing-a-local-commit-message">Editing a Local Commit Message</h4><p>If your commit is still local (i.e., you haven't pushed it to GitHub or any other remote repository), editing the commit message is simple and safe. To amend your most recent commit message, follow these steps:</p><ul><li>Open your command line and navigate to your repository.</li><li>Run the following command:</li></ul><pre><code class="language-shell">git commit --amend</code></pre><ul><li>This command opens your commit in an editor, allowing you to change the commit message.</li><li>After editing the message, save and close the editor.</li></ul><p>The <code>--amend</code> option rewrites your last commit with any changes you've staged, and in this case, with the new commit message you've provided. This action essentially replaces the old commit with a new one.</p><h4 id="amending-a-commit-message-after-pushing-to-a-remote-repository">Amending a Commit Message After Pushing to a Remote Repository</h4><p>Sometimes you might realize the need to change a commit message after it has been pushed to a remote repository. This situation is more complex because rewriting history in a shared repository can cause issues for other collaborators. However, if you still need to proceed, you can force push an amended commit.</p><ol><li>Amend your commit message locally following the steps mentioned above.</li><li>To push the amended commit to the remote repository, use:bashCopy codegit push --force-with-lease &lt;branch-name&gt;<br>Replace <code>&lt;branch-name&gt;</code> with the name of the branch where the commit resides.</li></ol><p>The <code>--force-with-lease</code> option is a safer alternative to a simple force push (<code>--force</code>). It ensures that you don't overwrite any work on the remote branch if there have been changes you aren't aware of.</p><h4 id="cautionary-notes">Cautionary Notes</h4><ul><li><strong>Use Force Push Sparingly</strong>: Force pushing changes the history of the repository. If other team members have already pulled the original commit, force pushing can create significant confusion and issues with the project history.</li><li><strong>Communicate with Your Team</strong>: If you decide to amend a commit that's already been pushed, it's crucial to inform your team members. They will need to take steps to sync their local histories with the remote repository after the change.</li></ul>
