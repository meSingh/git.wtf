---
title: Discard all changes when discarding is not working
type: post
published_at: '2020-02-29T00:00:00.000Z'
updated_at: '2023-06-04T18:24:12.000Z'
excerpt: >-
  Sometimes our setup gets messed up, or we mess it up in such a way that
  nothing seems to work; in those scenarios, use this command to discard
  anything you have done to start fresh."
tags:
  - accidents-recovery
  - git-add
  - git-commit
  - git-checkout
feature_image: null
meta_title: null
meta_description: >-
  Sometimes our setup gets messed up, or we mess it up in such a way that
  nothing seems to work; in those scenarios, use this command to discard
  anything you have done to start fresh."
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260613124402'
---

<p>A few days back, I had a strange issue, well, more of a weird server setup. I was working on a new client's server, and they had this wired setup with half of the code running &nbsp;<code>root</code> and half as a different user; all permissions were f!!cked up, and the client didn't want me to change anything because the setup was ancient, and any changes could break the system.</p><p>In all that mess, I had to make some test changes right on the server, but when I tried to reset them, they were not budging; no matter what way I tried, nothing seemed to work. I spent about 2 hours getting rid of everything I did to get the previous code back, but nothing was going my way, and after much research, I found something that worked like a charm:</p><pre><code class="language-sh">git checkout HEAD .
</code></pre><p>It checks out the most recent commit and reverts everything to it. There are several ways of doing this same thing, and I tried several of them, but this was the one that worked. So for me, this is what I will use to discard the changes when discarding is not working.</p><blockquote>PS: I had to run it with <code>sudo</code> to make it work...</blockquote>
