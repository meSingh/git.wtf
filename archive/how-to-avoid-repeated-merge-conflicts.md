---
title: How to avoid repeated merge conflicts?
type: post
published_at: '2019-06-06T00:00:00.000Z'
updated_at: '2023-11-02T13:02:26.000Z'
excerpt: >-
  I would recommend all developers to set up this globally; you will love it and
  won't even remember it.
tags:
  - solving-mistories
  - git-config
  - merge-conflicts
feature_image: null
meta_title: null
meta_description: >-
  I would recommend all developers to set up this globally; you will love it and
  won't even remember it.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613124140'
---

<p>As every developer knows, fixing merge conflicts can be tedious, but repeatedly solving the same conflict (e.g., in long-running feature branches) is annoying. If you’ve suffered from this, you’ll be happy to learn about the underused reuse recorded resolution feature. Add it to your global config to enable it for all projects:</p><pre><code class="language-shell">git config --global rerere.enabled true
</code></pre><p>Alternatively, you can enable it on a per-project basis by manually creating the directory <code>.git/rr-cache</code>.</p><p>This sure isn’t a feature for everyone, but it can be a real-time saver for people who need it. Imagine your team is working on various feature branches at the same time. Now you want to merge all of them into one testable pre-release branch. As expected, there are several merge conflicts, which you resolve. Unfortunately, it turns out that one of the branches isn’t quite there yet, so you decide to un-merge it again. Several days (or weeks) later, when the branch is finally ready, you merge it again, but thanks to the recorded resolutions, you won’t have to resolve the same merge conflicts again.</p><p>The man page (<code>man git-rerere</code>) has more information on further use cases and commands (<code>git rerere status</code>, <code>git rerere diff</code>, etc.).</p><p></p>
<!--kg-card-begin: html-->
<a href="https://dev.to/citizen428/10-common-git-problems-and-how-to-fix-them-234o?ref=git.wtf#7-avoid-repeated-merge-conflicts" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Dev.to (citizen428)
</a>
<!--kg-card-end: html-->
