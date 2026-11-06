---
title: How to checkout to a remote branch that someone else is working on in git?
type: post
published_at: '2017-12-12T00:00:00.000Z'
updated_at: '2023-05-30T11:37:11.000Z'
excerpt: >-
  Ever been in a situation where you need to collaborate with someone, but you
  don't have that branch on our local repo? How do we get that, as doing a
  checkout will not work?
tags:
  - solving-mistories
  - git-checkout
  - git-fetch
feature_image: null
meta_title: null
meta_description: >-
  Ever been in a situation where you need to collaborate with someone, but you
  don't have that branch on our local repo? How do we get that, as doing a
  checkout will not work?
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613113730'
---

<p>First, fetch all branches from remote:</p><pre><code class="language-bash">git fetch --all
</code></pre><p>Say you want to checkout to <code>production</code> from the remote.</p><pre><code class="language-bash">git checkout --track origin/production
# Branch production set up to track remote branch production from origin.
# Switched to a new branch 'production'
</code></pre><blockquote>(<code>--track</code> is shorthand for <code>git checkout -b [branch] [remotename]/[branch]</code>)</blockquote><p>This will give you a local copy of the branch <code>production</code>, and any update that has been pushed will also show up remotely</p><p></p><!--kg-card-begin: html--><a href="https://github.com/k88hudson/git-flight-rules?ref=git.wtf#i-want-to-checkout-to-a-remote-branch-that-someone-else-is-working-on" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Github (k88hudson)
</a><!--kg-card-end: html-->
