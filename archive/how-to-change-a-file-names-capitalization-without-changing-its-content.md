---
title: How to change a file name's capitalization without changing its content?
type: post
published_at: '2019-07-07T00:00:00.000Z'
updated_at: '2023-12-04T14:37:30.000Z'
excerpt: >-
  If you have a Windows setup, you must have faced the annoying issue of file
  name case change. Where you changed the file name capitalization, but it just
  doesn't show up.
tags:
  - solving-mistories
  - git-mv
feature_image: null
meta_title: null
meta_description: >-
  If you have a Windows setup, you must have faced the annoying issue of file
  name case change. Where you changed the file name capitalization, but it just
  doesn't show up.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713162343'
---

<p>Working with a team of various backgrounds is always tricky; everyone has their way of doing things, standards, preferences, and styles. One of these preferences is the way we name our files. People do it in several ways; for me, it's always <strong>kebab-case</strong>, but some of my colleagues like to call it <strong>snake_case</strong>, and others do it in <strong>camelCase</strong>.</p><p>When writing a standard code, it's always essential to keep the conventions similar for a cleaner code, and for that, we have to change each other file names according to the one set as default for that particular project.</p><p>Doing so in your local file system is pretty straightforward, but git is case-insensitive and does not recognize the changes made in the file name if you have not changed any letter. So as long as you are changing to an entirely different style, that is, kebab-case to camelCase, you should be fine, but if you are only changing the capitalization, you are <em>fucked</em>. To do this, you need to run the following command:</p><pre><code class="language-shell">git mv --force myfile MyFile
</code></pre><p></p>
<!--kg-card-begin: html-->
<a href="https://github.com/k88hudson/git-flight-rules?ref=git.wtf#i-want-to-change-a-file-names-capitalization-without-changing-the-contents-of-the-file" target="_blank" rel="noopener noreferrer" class="git-article-source">
    Originally Posted On: Github (k88hudson)
</a>
<!--kg-card-end: html-->
