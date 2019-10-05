---
title: "Using POSIX sed for infile substitution"
date: 2019-10-05T08:58:20-04:00
draft: false 
keywords: ["sed", "scripting", "posix"]
description: ""
tags: ["sed", "scripting", "posix"]
categories: ["scripting"]
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

Something I learned when I started writing tools for developers in companies is
that there's [GNU `sed`](https://www.unix.com/man-page/Linux/1/sed/), [BSD
`sed`](https://www.unix.com/man-page/FreeBSD/1/sed/) and that they are not
compatible for something that I tend to write a lot: infile substitution.

I would find myself doing conditionals, finding out if it was running in a
Darwin/BSD or if it was running on Linux. Then there was the bit where some
people would install `gnu-sed` from Homebrew in their macs and add the gnubin
path to their `$PATH` which then would break my conditionals because they would
be using GNU `sed` in which I thought were BSD `sed`.

This made really hard building scripts that would work both in all developers
machines and deployment servers.

In goes [POSIX
`sed`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html). So
there's a "standard" which not many people limits itself to use, because using
`-i` is too convenient, which BSD and GNU both implement yet differently (one
requires `-i ''` the other either `-i` or `-i''` so both implementations are
incompatible between themselves). But POSIX `sed` only has `-e`, `-f` and `-n`.

So easy, right? Let's just do a `sed` and pipe it out to the same file:

    sed -e "s/foo/bar/" "filename" > "filename"

Done. Is it? No! If you check the content of the file it will be blank. So you
need to create a temp file, modify it and then remove the temp file:

    sed -e "s/foo/bar/" "filename" > "filename.tmp"
    mv "filename.tmp" "filename"

So it's basically your call to decide if you can write an extra line of code on
your scripts or write a whole logic to figure out what `sed` is being used and
if it should be `-i` or `-i ''`.
