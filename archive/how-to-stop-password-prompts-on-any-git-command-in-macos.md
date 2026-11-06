---
title: How to stop password prompts on any git command in macOS?
type: post
published_at: '2017-12-08T00:00:00.000Z'
updated_at: '2023-05-30T07:18:05.000Z'
excerpt: >-
  Ever since macOS 10.12 Sierra update for ssh, people have been facing issues
  with git prompting for ssh passphrase every time they run any git command.
tags:
  - solving-mistories
  - ssh
  - macos
feature_image: null
meta_title: null
meta_description: >-
  Ever since macOS 10.12 Sierra update for ssh, people have been facing issues
  with git prompting for ssh passphrase every time they run any git command.
canonical_url: null
authors:
  - Mandeep Singh
source: wayback
wayback_ts: '20260713160343'
---

<p>Ever since macOS 10.12 Sierra update for ssh, people have been facing issues with git prompting for ssh passphrase every time they run any git command.</p><p>Although It’s been a long time since the release, I still see many developers asking me this, so I thought to write a simple solution here.</p><h3 id="what-do-you-need-to-do">What do you need to do?</h3><p>For macOS 10.12, Sierra <code>ssh-add -K</code> needs to be run after every reboot. To avoid this, create <code>~/.ssh/config</code> this content.</p><pre><code class="language-bash">Host *
    UseKeychain yes
</code></pre><p>That is all you need to do, and you are good to go.</p>
