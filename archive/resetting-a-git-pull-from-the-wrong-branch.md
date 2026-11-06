---
title: Resetting a git pull from the wrong branch
type: post
published_at: '2020-03-02T00:00:00.000Z'
updated_at: '2023-12-17T08:37:57.000Z'
excerpt: "I don't know about you, but this happens to me all the time; I accidentally pull in the wrong branch, curse a bit, call myself some names \U0001F92C, and then apply this fix, which is effortless if you understand the concept well enough."
tags:
  - accidents-recovery
  - git-reset
  - git-pull
feature_image: null
meta_title: null
meta_description: "I don't know about you, but this happens to me all the time; I accidentally pull in the wrong branch, curse a bit, call myself some names \U0001F92C, and then apply this fix, which is effortless if you understand the concept well enough."
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713145916'
---

<p>I don't know about you, but this happens to me all the time; I accidentally take a pull in the wrong branch, then curse a bit, call myself some name 🤬, and then apply this fix. This fix has been a lifesaver for me, and it's also effortless if you understand the concept well enough.</p><p>Let's say you pulled in a <code>develop</code> branch into your <code>master</code> and the code is not yet ready to go live, now the good thing about Git is that it always keeps a copy of your remote at <code>ORIG_HEAD</code> so if you need to revert to it, you can tell Git to reset back to the remote version by using the following command:</p><pre><code class="language-sh">git reset --hard ORIG_HEAD
</code></pre><p>This solution works great in most cases, but sometimes you only want to move back a few commits, or the merge/pull has not gone through due to conflicts. In those cases, you can tell git only to discard current changes i.e.</p><pre><code class="language-sh">git reset --hard
</code></pre><p>Or, in case of resetting the last three commits:</p><pre><code class="language-sh">git reset --hard HEAD~2
</code></pre><p>I hope this will save you much headache every month as it does for me 😉</p><blockquote>PS: you can check your HEAD counts on how far you want to go using <code>git reflog</code></blockquote><hr><blockquote>This solution can also be used to:<br>- Resetting a git branch back to it's remote HEAD<br>- Getting rid of git merge conflicts<br>- Resetting HEAD to last stable commit in git</blockquote><p></p>
<!--kg-card-begin: html-->
<a href="https://stackoverflow.com/a/3998923/1680002?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: StackOverflow
</a>
<!--kg-card-end: html-->
