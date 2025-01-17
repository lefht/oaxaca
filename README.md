### git time machine
```git 
    git reflog
    # you will see a list of every thing you've
    # done in git, across all branches!
    # each one has an index HEAD@{index}
    # find the one before you broke everything
    git reset HEAD@{index}
    # magic time machine
```

### uncommit and make small changes

```git
    # make your change
    git add . # or add individual files
    git commit --amend --no-edit
    # now your last commit contains that change!
    # WARNING: never amend public commits
```

### change message on last commit
```git
    git commit --amend
    # follow prompts to change the commit message
```