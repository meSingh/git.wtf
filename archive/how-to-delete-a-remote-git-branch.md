---
title: 'How to Delete a Remote Git Branch: A Step-by-Step Guide'
type: post
published_at: '2023-12-04T11:33:33.000Z'
updated_at: '2023-12-04T11:33:33.000Z'
excerpt: >-
  Working with Git involves not just managing your local branches but also
  handling your remote branches, especially when collaborating in a team.
  Deleting remote branches is a common task in Git workflows, particularly after
  the completion of features or fixes.
tags:
  - learn-git
  - git-push
  - git-branch
feature_image: null
meta_title: null
meta_description: >-
  Working with Git involves not just managing your local branches but also
  handling your remote branches, especially when collaborating in a team.
  Deleting remote branches is a common task in Git workflows, particularly after
  the completion of features or fixes.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613131049'
---

<p> Here’s a straightforward guide on how to delete a remote Git branch.</p><h4 id="understanding-remote-branch-deletion">Understanding Remote Branch Deletion</h4><p>When you push a branch to a remote repository (like GitHub or Bitbucket), it exists independently from your local branches. After merging a feature branch into the main branch, it's often good practice to delete the remote feature branch to keep the repository clean and organized.</p><h4 id="the-command-to-delete-a-remote-branch">The Command to Delete a Remote Branch</h4><p>To delete a remote branch, you need to push a delete command to the remote repository. This is done using the <code>--delete</code> flag with the <code>git push</code> command. Here’s the basic syntax:</p><pre><code class="language-shell">git push &lt;remote-name&gt; --delete &lt;branch-name&gt;</code></pre><ul><li><code>&lt;remote-name&gt;</code> is the name of the remote repository. For most projects, this is usually <code>origin</code>.</li><li><code>&lt;branch-name&gt;</code> is the name of the branch you want to delete.</li></ul><h4 id="example">Example</h4><p>If you want to delete a branch named <code>feature-xyz</code> from the <code>origin</code> remote, the command would be:</p><pre><code class="language-shell">git push origin --delete feature-xyz</code></pre><p>This command tells Git to delete the <code>feature-xyz</code> branch from the remote repository named <code>origin</code>.  </p><h4 id="points-to-remember">Points to Remember</h4><ul><li>Ensure that the branch you are deleting is no longer needed by you or your team members. Once deleted, the remote branch cannot be recovered easily.</li><li>Deleting a remote branch does not delete the corresponding local branch. If you also want to delete the local branch, you will need to use a separate command (<code>git branch -d &lt;branch-name&gt;</code>) in your local repository.</li></ul><p></p><h4 id="you-may-also-want-to-see">You may also want to see: </h4><figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="/how-to-delete-a-local-git-branch-a-practical-guide/"><div class="kg-bookmark-content"><div class="kg-bookmark-title">How to Delete a Local Git Branch: A Step-by-Step Guide</div><div class="kg-bookmark-description">Git branches are essential for managing different features or aspects of your project. However, as your project evolves, you might end up with several branches that are no longer needed.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="/content/images/2023/06/gitwtf-icon2.png" alt=""><span class="kg-bookmark-author">GIT.WTF!?!</span><span class="kg-bookmark-publisher">Mandeep Singh</span></div></div><div class="kg-bookmark-thumbnail"><img src="/content/images/2023/06/social-1.png" alt=""></div></a></figure>
