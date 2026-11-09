---
title: How to sync my commits with multiple repositories in git?
type: post
published_at: '2016-11-03T00:00:00.000Z'
updated_at: '2023-05-30T07:10:14.000Z'
excerpt: >-
  There are many ways of doing this; some include custom scripts, apps, and even
  some paid services. We will do this using the most straightforward way of
  having multiple URLs for a single remote.
tags:
  - solving-mistories
  - git-remote
  - git-push
feature_image: null
meta_title: null
meta_description: >-
  There are many ways of doing this; some include custom scripts, apps, and even
  some paid services. We will do this using the most straightforward way of
  having multiple URLs for a single remote.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613114027'
---

<p>Let's say you have added your original remote like this:</p><pre><code class="language-shell">git remote add origin origin-host:path/to/project.git
</code></pre><p>What many people don't know is that you have the option to add multiple hosts for the same remote. You can do this by simply adding your second host to the same remote like this:</p><pre><code class="language-shell">git remote set-url --add origin second-host:path/to/project.git
</code></pre><p>You can do this whenever you want to have any hosts.</p><pre><code class="language-shell">git remote set-url --add origin third-host:path/to/project.git
git remote set-url --add origin fourth-host:path/to/project.git
git remote set-url --add origin fiveth-host:path/to/project.git
</code></pre><p>Your config file will look something like this:</p><pre><code class="language-shell">[remote "origin"]
    url = origin-host:path/to/project.git
    url = second-host:path/to/project.git
    url = third-host:path/to/project.git
</code></pre><p>Now you can push your changes with a single command, which will be synced to all repositories.</p><pre><code class="language-shell">git push origin {branch name}
</code></pre><p></p><h4 id="further-reading">Further Reading: </h4><figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://gist.github.com/rvl/c3f156e117e22a25f242?ref=git.wtf"><div class="kg-bookmark-content"><div class="kg-bookmark-title">How to push to multiple git remotes at once. Useful if you keep mirrors of your repo.</div><div class="kg-bookmark-description">How to push to multiple git remotes at once. Useful if you keep mirrors of your repo. - git-pushing-multiple.rst</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://gist.github.com/fluidicon.png" alt=""><span class="kg-bookmark-author">Gist</span><span class="kg-bookmark-publisher">262588213843476</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://github.githubassets.com/images/modules/gists/gist-og-image.png" alt=""></div></a></figure><p></p><!--kg-card-begin: html--><a href="http://stackoverflow.com/questions/5785549/able-to-push-to-all-git-remotes-with-the-one-command/5785618?ref=git.wtf#5785618" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: StackOverflow
</a><!--kg-card-end: html-->
