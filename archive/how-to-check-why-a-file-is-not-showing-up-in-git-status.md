---
title: How do you check why a file is not in the git status?
type: post
published_at: '2019-07-07T00:00:00.000Z'
updated_at: '2023-06-04T11:04:31.000Z'
excerpt: >-
  Ever had a problem, when you add a new file or make changes to an existing one
  but it just doesn't show up in git status? We got a solution for you.
tags:
  - solving-mistories
  - git-status
  - gitignore
feature_image: null
meta_title: null
meta_description: >-
  Ever had a problem, when you add a new file or make changes to an existing one
  but it just doesn't show up in git status? We got a solution for you.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613130059'
---

<p>If you are working on someone else's code or working in a team, it is quite possible that at some point, you add a new file to git, but it just won't show up on git status. You won't be able to stage or add it. This generally happens because of one of the rules in some <code>.gitignore</code> the file is blocking that file.</p><p>In most cases, you have a single <code>.gitignore</code> file in your project root, and you can easily find the issue and correct it but if the project is big, or you are using a framework, or you forgot about global <code>.gitignore</code>, it is going to be hard to find the real culprit unless you know this command:</p><pre><code class="language-shell">git check-ignore -v path/to/ignored/file
</code></pre><p>By using this command, you will be able to find the exact file and the exact rule with a line number that is blocking your file. Try it out yourself and see if it completes your job.</p><p></p><!--kg-card-begin: html--><a href="https://laravel-news.com/debugging-gitignore?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Laravel News
</a><!--kg-card-end: html-->
