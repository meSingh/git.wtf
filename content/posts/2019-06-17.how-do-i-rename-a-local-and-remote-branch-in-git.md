---
title: How do I rename a local and remote branch in git?
category: solving-mistories
tags:
- rename
- branch
- remote
- local
source: https://multiplestates.wordpress.com/2015/02/05/rename-a-local-and-remote-branch-in-git/
author: bsahil
---

Generally mistakes happen. If you have named a branch that you were not thought of it and pushed it to remote repository.
Then there is a chance to change it again. Follow the steps below:-

### Rename your local branch
```shell
# To rename a branch
git branch -m new-branch-name

# To rename a different branch
git branch -d old-branch-name new-branch-name
```
#### To delete the old named remote branch and push the new named local branch
```shell
git push origin :old-branch-name new-branch-name
```
#### To reset the upstream branch for the new named local branch
Switch to the branch and then run the following command
```shell
git push origin -u new-branch-name
```
