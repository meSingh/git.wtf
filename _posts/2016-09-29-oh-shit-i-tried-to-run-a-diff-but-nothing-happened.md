---
layout: post
title: Oh shit, I tried to run a diff but nothing happened?!
---

{% highlight sh %}
$ git diff --staged
{% endhighlight %}

Git won't do a diff of files that have been add-ed to your staging area without this flag. File under ¯(ツ)/¯ (yes, this is a feature, not a bug, but it's baffling and non-obvious the first time it happens to you!)
