---
layout: post
title: How to move accidentally committed changes to a brand new branch
source: http://ohshitgit.com/
---

{% highlight sh %}
# create a new branch from the current state of master
$ git branch some-new-branch-name
# this is were your commit will live :)
{% endhighlight %}

{% highlight sh %}
# now go back to master
$ git checkout master
# remove the commit from the master branch
$ git reset HEAD~ --hard
# whoola!! you are back on track
{% endhighlight %}

<!--break-->

#### the other way of doing this:

{% highlight sh %}
# undo the last commit, but leave the changes available
$ git reset HEAD~ --soft
$ git stash
# move to the correct branch
$ git checkout name-of-the-correct-branch
$ git stash pop
$ git add . # or add individual files
$ git commit -m "your message here"
# now your changes are on the correct branch
{% endhighlight %}

A lot of people suggest using cherry-pick for this situation too, so take your pick on whatever one makes the most sense to you!

#### yet another way:

{% highlight sh %}
$ git checkout name-of-the-correct-branch
# grab the last commit to master
$ git cherry-pick master
# delete it from master
$ git checkout master
$ git reset HEAD~ --hard
{% endhighlight %}
