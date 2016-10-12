---
layout: post
title: How to run a diff on unstagged changes?
source: http://ohshitgit.com/
---

{% highlight sh %}
$ git diff --staged
{% endhighlight %}

Git won't do a diff of files that have been add-ed to your staging area without this flag. File under ¯(ツ)/¯ (yes, this is a feature, not a bug, but it's baffling and non-obvious the first time it happens to you!)
