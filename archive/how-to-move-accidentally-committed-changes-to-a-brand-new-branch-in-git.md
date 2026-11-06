---
title: How to move accidentally committed changes to a brand new branch in git?
type: post
published_at: '2016-09-29T19:03:00.000Z'
updated_at: '2023-05-29T19:05:13.000Z'
excerpt: >-
  Moving between different branches is tricky if you don't remember all the
  steps, but you can always bookmark this page.
tags:
  - accidents-recovery
  - git-commit
  - git-reset
  - git-stash
  - git-checkout
  - git-cherry-pick
feature_image: null
meta_title: null
meta_description: >-
  Moving between different branches is tricky if you don't remember all the
  steps, but you can always bookmark this page.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613130933'
---

<pre><code class="language-bash"># create a new branch from the current state of master
git branch some-new-branch-name
# this is were your commit will live :)
</code></pre><pre><code class="language-bash"># now go back to master
git checkout master
# remove the commit from the master branch
git reset HEAD~ --hard
# whoola!! you are back on track
</code></pre><h4 id="the-other-way-of-doing-this">the other way of doing this:</h4><pre><code class="language-bash"># undo the last commit, but leave the changes available
git reset HEAD~ --soft
git stash
# move to the correct branch
git checkout name-of-the-correct-branch
git stash pop
git add . # or add individual files
git commit -m "your message here"
# now your changes are on the correct branch
</code></pre><p>Many people suggest using cherry-pick for this situation, too, so take your pick on whatever makes the most sense to you!</p><h4 id="yet-another-way">yet another way:</h4><pre><code class="language-bash">git checkout name-of-the-correct-branch
# grab the last commit to master
git cherry-pick master
# delete it from master
git checkout master
git reset HEAD~ --hard
</code></pre><!--kg-card-begin: html--><a href="http://ohshitgit.com/?ref=git.wtf" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: OhShitGit
</a><!--kg-card-end: html-->
