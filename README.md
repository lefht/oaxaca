### Dangit, I did something terribly wrong, please tell me git has a magic time machine!?!
```git 
git reflog
# you will see a list of every thing you've
# done in git, across all branches!
# each one has an index HEAD@{index}
# find the one before you broke everything
git reset HEAD@{index}
# magic time machine

```