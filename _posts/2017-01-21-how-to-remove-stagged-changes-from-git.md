---
layout: post
title: How to remove staged changes from git
source: http://data.agaric.com/undo-git-add-remove-files-staged-git-commit
---
To remove your stagged changes or to undo your last `git add` command you can simply use `git reset`

Running the below command will simply remove all files from your staging area:
{% highlight sh %}
$ git reset
{% endhighlight %}

In case you want to remove the a specifc file(s) then you can mention the name of these files, like this:
{% highlight sh %}
$ git reset filename.ext
{% endhighlight %}
