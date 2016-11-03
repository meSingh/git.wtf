---
layout: post
title: How to sync my commits with multiple repositories
source: http://stackoverflow.com/questions/5785549/able-to-push-to-all-git-remotes-with-the-one-command/5785618#5785618
---
There are many ways of doing this, some include custom scripts, app and even some paid services. We will do this using the simplest way of having multiple urls for a single remote.

Let's say you have added your original remote like this:

{% highlight sh %}
$ git remote add origin origin-host:path/to/project.git
{% endhighlight %}

What many people don't know is that you have an option to added multiple hosts for the same remote. You can do this by simply adding your second host to same remote like this:

{% highlight sh %}
$ git remote set-url --add origin second-host:path/to/project.git
{% endhighlight %}

<!--break-->

You can do this any number of times you want can have any number of hosts..

{% highlight sh %}
$ git remote set-url --add origin third-host:path/to/project.git
$ git remote set-url --add origin fourth-host:path/to/project.git
$ git remote set-url --add origin fiveth-host:path/to/project.git
{% endhighlight %}

Your config file will look something like this:

{% highlight sh %}
[remote "origin"]
    url = origin-host:path/to/project.git
    url = second-host:path/to/project.git
    url = third-host:path/to/project.git
{% endhighlight %}


Now you can simply push your changes with a single command and they will be synced to all repositories.

{% highlight sh %}
$ git push origin {branch name}
{% endhighlight %}
