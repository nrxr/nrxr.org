+++
autoCollapseToc = false
categories = ["go"]
comment = false
date = 2022-08-01T03:00:00Z
description = ""
draft = true
hiddenFromHomePage = false
keywords = ["go"]
mathjax = false
mathjaxEnableAutoNumber = false
mathjaxEnableSingleDollar = false
postMetaInFooter = false
reward = false
tags = ["go"]
title = "Can't download go mod from private repository with correct credentials"
toc = false
[flowchartDiagrams]
enable = false
options = ""
[sequenceDiagrams]
enable = false
options = ""

+++
Today I tried to run a `go mod tidy` in my machine and suddendly failed:

```
❯ go mod tidy
    go: github.com/xxx/abc@v1.0.0 requires
    	github.com/xxx/xyz@v0.1.6: reading github.com/xxx/xyz/go.mod at revision v0.1.6: git ls-remote -q origin in /Users/nrxr/code/pkg/mod/cache/vcs/efbaf026601e6db5d33d6c9020672ec8dd313d341c34f6b77702d1d831b3c925: exit status 128:
    	fatal: 'origin' does not appear to be a git repository
    	fatal: Could not read from remote repository.
    
    	Please make sure you have the correct access rights
    	and the repository exists.
```

Reading the error message would make you suppose it's a credentials issue downloading from the private repository, yet, I could clone the repository without issues. I had access to `xxx/xyz` repo and my `netrc` has the right credentials there. `go get` would also fail miserably.

After doing some debugging I figured out it was "solved" by removing my `$GOPATH/pkg` and running `go mod tidy` again. Nothing else changed. So I guess after I updated my Go version to `go1.18.5` earlier that day this stopped working, somehow.