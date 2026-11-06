---
title: How to stage changes one by one after reviewing in git?
type: post
published_at: '2017-12-18T00:00:00.000Z'
updated_at: '2023-05-30T11:43:55.000Z'
excerpt: >-
  Usually, it is recommended to create a new fix branch from your master and
  push it back, but sometimes we kind of go lazzy. In those moments, I simply
  make the changes and add them one by one using the following command.
tags:
  - solving-mistories
  - git-add
feature_image: null
meta_title: null
meta_description: >-
  Usually, it is recommended to create a new fix branch from your master and
  push it back, but sometimes we kind of go lazzy. In those moments, I simply
  make the changes and add them one by one using the following command.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260415185644'
---

<p>When working on your code, there are some situations when you might have to push a simple fix or a piece of code. Usually, it is recommended to create a new fix branch from your master and push it back, but sometimes we kind of go lazzy. In those movements, I make the changes and add them one by one using the following command:</p><pre><code class="language-shell">git add -p
</code></pre><p>I believe it’s worth mentioning how I learned about this lovely little helper.</p><figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">🔥 Git Tip: Use `git add -p` to review and add changes hunk-by-hunk. Handy when you want to break a single file's changes into two commits <a href="https://t.co/VH2SGl48FS?ref=git.wtf">pic.twitter.com/VH2SGl48FS</a></p>— Wes Bos (@wesbos) <a href="https://twitter.com/wesbos/status/803260420022738944?ref_src=twsrc%5Etfw&amp;ref=git.wtf">November 28, 2016</a></blockquote>

</figure><p></p><!--kg-card-begin: html--><a href="https://twitter.com/wesbos/status/803260420022738944?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Twitter (wesbos)
</a><!--kg-card-end: html-->
