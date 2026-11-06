---
title: How to show a commit’s patch pertaining to a specific path?
type: post
published_at: '2019-09-27T00:00:00.000Z'
updated_at: '2023-06-04T13:30:58.000Z'
excerpt: "When viewing the patch of a certain commit with git show &lt;commit&gt;\_you’re only interested in a certain part of it, related to a file or a directory."
tags:
  - improving-workflow
  - git-show
feature_image: null
meta_title: null
meta_description: "When viewing the patch of a certain commit with git show &lt;commit&gt;\_you’re only interested in a certain part of it, related to a file or a directory."
canonical_url: null
authors:
  - Matija Marohnić
source: wayback
wayback_ts: '20260415193139'
---

<p>When viewing the patch of a certain commit with <code>git show &lt;commit&gt;</code> you’re only interested in a certain part of it, related to a file or a directory. In that case instead of searching for that part of the patch you can simply append the path:</p><pre><code class="language-shell">git show &lt;commit&gt; -- &lt;path&gt;
</code></pre><p>So, for example, if you wanted to see which changes were made to the files inside the directory helpers/users by the commit <code>72c8fbde</code>, you would run:</p><pre><code class="language-shell">git show&nbsp;72c8fbde&nbsp;-- helpers/users
</code></pre>
