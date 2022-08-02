+++
autoCollapseToc = false
categories = ["config", "git", "go"]
comment = false
date = 2022-08-02T21:00:00Z
description = ""
hiddenFromHomePage = false
keywords = []
mathjax = false
mathjaxEnableAutoNumber = false
mathjaxEnableSingleDollar = false
postMetaInFooter = false
reward = false
tags = ["config", "git", "go"]
title = "Configuring Git and Go for private modules without netrc"
toc = false
[flowchartDiagrams]
enable = false
options = ""
[sequenceDiagrams]
enable = false
options = ""

+++
So far, I had used the [personal tokens method for authorizing myself against GitHub when working with private modules](https://go.dev/doc/faq#git_https), but now I figured out how to make it work directly with Git and my SSH config already existing.

TL;DR;

```
# vim ft=gitconfig
# ~/.gitconfig

[url "ssh://git@github.com/nrxr"]
  insteadOf = https://github.com/nrxr
  
[url "ssh://git@x.github.com/employer"]
  insteadOf = https://github.com/employer
```

```
# vim ft=sshconfig
# ~/.ssh/config

Host x.github.com
  HostName github.com
  IdentityFile %d/path/to/employer-configure-ssh-key
```

Now the long version:

I do have separate GitHub accounts for my personal stuff and work. A headache was using private Go modules because I had to change my `~/.netrc` content based on which account I was using. Which was not so bad but wasn't optimal neither. Also, Github's personal token was another credential I had to manage its lifecycle and honestly I prefer to just manage my SSH keys.

I follow the Go's structure for coding, so my code lives in `~/code/src/github.com/nrxr`, that means I use the same for my employer `~/code/src/github.com/employer` and it was predictable where I needed to load certain configuration values for Git, hence I have a conditional loading configuration file:

```
# part of ~/.gitconfig`

[includeIf "gitdir:~/code/src/github.com/employer/"]
  path = ~/.gitconfig-private-work
```

And in that file I have:

```
# content of ~/.gitconfig-private-work
[url "git@x.github.com"]
  insteadOf = git@github.com
```

Because as you can see at the top of this post, my `~/.ssh/config` has a Host set for my employer's SSH key with that domain. This also means I don't have to change the domain each time I'm running `git clone` which saves me time.

I thought at first, that was the right place to put the `insteadOf` directive but Go can't figure out what's the right VCS from the username. So I tried with the ssh from https substitution I showed in the post. Yet, it didn't work. I tried something like this:

```
[url "ssh://git@x.github.com"]
  insteadOf = https://github.com
```

Then it hit me. The conditional include means it only acts when in that folder and Go actually executes it in `$GOPATH/pkg`, not in my `$GOPATH/src` where I edit my code. So the solution was to put the `insteadOf` directive in my global configuration but limit the scope by adding the path, like this:

```
[url "ssh://git@x.github.com/employer"]
  insteadOf = https://github.com/employer
 ```
 
 And now, I don't need to change my `~/.netrc` file or generate a new token each 30 days. :)