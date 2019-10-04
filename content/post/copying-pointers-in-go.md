---
title: "Copying Pointers in Go"
date: 2019-10-03T21:20:40-04:00
draft: false
keywords: ["go", "golang", "pointers"]
description: ""
tags: ["go", "golang", "pointers"]
categories: ["go"]
author: ""

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: false
toc: false
autoCollapseToc: false
postMetaInFooter: true
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
# contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
# hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
# enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

Over a year ago I was trying to make a copy of a `*url.URL` and ended up with
[this quite nasty way to do
so](https://medium.com/@nrxr/quick-dirty-way-to-deep-copy-a-url-url-on-go-464312241de4).
I even [applied this to
`maskpass`](https://github.com/nrxr/maskpass/blob/master/maskpass.go#L22), a
small package that masks the password of an url.URL to make it log-friendly.

But today, looking for a nice clean way to do so in a PR being sent to Go I
realized `tmp := *src` does the work nicely.

    package main

    import (
      "fmt"
      "net/url"
    )

    func main() {
      src, _ := url.Parse("http://user:password@host.tld/")
      tmp := *src
      tmp.User = url.UserPassword(tmp.User.Username(), "xxxxx")
      fmt.Printf("%s, %s", src.String(), tmp.String())
    }

https://play.golang.org/p/F4vaqN3wC_H

What this shows is that changing values in `tmp` won't change the values in
`src` so you have effectively copied the values of the source pointer to a new
pointer.

So, if you're looking for a clean way to copy the value of a pointer in Go,
hopefully, this will help you.
