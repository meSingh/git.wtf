<img src="https://raw.githubusercontent.com/meSingh/ohshitgit/master/ohshit.png" align="right" width="130px"/>
Oh, shit, git!
=============

Git is hard: screwing up is easy, and figuring out how to fix your mistakes is fucking impossible.

So here are some common bad situations and how you can get out of them _in plain english_*.


## Oh shit, I did something terribly wrong, is there a magic time machine!?!
```sh
$ git reflog
# you will see a list of every thing you've done in git, across all branches!
# each one has an index HEAD@{index}
# find the one before you broke everything
$ git reset HEAD@{index}
# magic time machine
```
You can use this to get back stuff you accidentally deleted, or just to remove some stuff you tried that broke the repo.


## Oh shit, I need to change the message on my last commit!
```sh
$ git commit --amend
# follow prompts to change the commit message
```
Stupid commit message formatting requirements.


## Oh shit, I accidentally committed something to master that should have been on a brand new branch!
```sh
# create a new branch from the current state of master
$ git branch some-new-branch-name
# this is were your commit will live :)
```

```sh
# now go back to master
$ git checkout master
# remove the commit from the master branch
$ git reset HEAD~ --hard
# whoola!! you are back on track
```
Note: this doesn't work if you've already pushed to origin, and if you tried other things first, you might need to `git reset HEAD@{number}` instead of `HEAD~`. Infinite sadness.

#### the other way of doing this:
```sh
# undo the last commit, but leave the changes available
$ git reset HEAD~ --soft
$ git stash
# move to the correct branch
$ git checkout name-of-the-correct-branch
$ git stash pop
$ git add . # or add individual files
$ git commit -m "your message here"
# now your changes are on the correct branch
```
A lot of people suggest using cherry-pick for this situation too, so take your pick on whatever one makes the most sense to you!


#### yet another way:
```sh
$ git checkout name-of-the-correct-branch
# grab the last commit to master
$ git cherry-pick master
# delete it from master
$ git checkout master
$ git reset HEAD~ --hard
```


## Oh shit, I tried to run a diff but nothing happened?!
```sh
$ git diff --staged
```
Git won't do a diff of files that have been `add`-ed to your staging area without this flag. File under ¯_(ツ)_/¯ (yes, this is a feature, not a bug, but it's baffling and non-obvious the first time it happens to you!)


## Fuck this noise, I give up.
```sh
$ cd ..
$ sudo rm -r fucking-git-repo-dir
$ git clone https://some.github.url/fucking-git-repo-dir.git
$ cd fucking-git-repo-dir
```

<br><br>
Originally sourced from  [ohshitgit](http://ohshitgit.com), improved, new features added & old one's updated for a better workflow. 
