---
title: How to Delete the Earliest Commit in History Using git-filter-repo
type: post
published_at: '2024-07-31T08:30:42.000Z'
updated_at: '2024-07-31T08:30:42.000Z'
excerpt: >-
  Learn how to remove the earliest commit in your repository's history using
  git-filter-repo. Follow these steps carefully to avoid issues.
tags:
  - commit-removal
  - git-filter-repo
  - repository-management
feature_image: null
meta_title: null
meta_description: >-
  Learn how to remove the earliest commit in your repository's history using
  git-filter-repo. Follow these steps carefully to avoid issues.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20261003044641'
---

<p>Version control systems are essential tools for developers, allowing them to track changes, collaborate, and manage code efficiently. One common task developers might face is the need to remove specific commits from their project history. This can be particularly necessary when sensitive information has been committed by mistake or when a series of commits need to be cleaned up for clarity and simplicity. In this post, we will explore how to delete the earliest commit in your repository's history using the powerful <code>git-filter-repo</code> tool.</p><p>First, it’s important to understand that <code>git-filter-repo</code> is a versatile tool designed to rewrite Git history. It is a replacement for the older <code>git filter-branch</code> command, providing a more efficient and user-friendly way to manipulate Git repositories. For detailed documentation on <code>git-filter-repo</code>, you can visit the official <a href="https://github.com/newren/git-filter-repo?ref=git.wtf">Git documentation</a>.</p><p>To remove the earliest commit, you will utilize the <code>--commit-callback</code> option. This option allows you to specify a callback function that determines which commits to keep or skip during the filtering process. The following command illustrates how to skip the earliest commit based on its original commit ID:</p><pre><code class="language-sh">git filter-repo --commit-callback \
  'if commit.original_id.startswith(b"ae01e9c"):
    commit.skip()'
</code></pre><p>In this command, replace <code>ae01e9c</code> with the actual hash of the commit you wish to delete. This hash can be found by checking your commit history using <code>git log</code>. The <code>commit.skip()</code> function tells <code>git-filter-repo</code> to ignore this specific commit when rewriting the history.</p><p>However, it’s crucial to note that there is a known bug associated with the <code>--commit-callback</code> option. According to a discussion on Stack Overflow, using <code>commit.skip()</code> might inadvertently skip all subsequent commits. This issue arises if you attempt to skip multiple commits, but in the case of removing the earliest commit, it should be safe since there are no subsequent commits that would be affected.</p><p>Before proceeding with any history manipulation, it is highly advisable to create a backup of your repository. This precaution ensures that you have a recovery point in case anything goes wrong during the filtering process. You can create a backup by simply cloning your repository to a different directory:</p><pre><code class="language-sh">git clone --mirror &lt;repository-url&gt; &lt;backup-directory&gt;
</code></pre><p>After ensuring that you have a backup, run the <code>git filter-repo</code> command as shown earlier. Once the command has successfully executed, you will have effectively removed the specified commit from your repository's history. Remember to inform your team members about this change, as it alters the commit history and may affect any branches that were based on the previous state of the repository.</p><p>While <code>git-filter-repo</code> is a powerful tool for rewriting history, always exercise caution when manipulating commits. Understanding the implications of these changes is vital for maintaining the integrity of your project. For more advanced usage and additional options, refer to the <a href="https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html?ref=git.wtf">official documentation</a>.</p>
