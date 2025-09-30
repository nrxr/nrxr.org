---
title: Stop creating branches with git checkout -b
date: 2025-09-30T03:00:00.000Z
---

I have been using the command `git checkout -b <branch>` all these years for creating branches, and it was quite frustrating that I had to add `git branch --set-upstream-to=origin/<branch> <branch>` afterwards.

And then I had the amazing idea of RTFM, after `man git-branch` and then `man git-checkout` I get to this gem:

```
    git checkout(-b | -B) < new- branch > [<start-point>]
      Specifying -b causes a new branch to be created as if git-branch(1) were called
      and then checked out.
      In this case you can use the --track or --no-track options, which will be passed
      to git branch. As a convenience, --track without -b implies branch creation; see
      the description of --track below.
```

\
So, as a convenience, I could use `git checkout -t <branch>` since the `-t` implies `-b`. And that's definitely shorter than the `git branch --set-upstream-to=...`.
