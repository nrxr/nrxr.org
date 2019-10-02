---
title: "Using multi-stage Dockerfile for small Go docker images"
date: 2019-10-02T18:39:10-04:00
draft: false
keywords: ["docker", "how to"]
description: ""
tags: ["docker", "go", "deployment", "dockerfile"]
categories: ["docker", "go"]

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: false
toc: true
autoCollapseToc: false
postMetaInFooter: true
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
# contentCopyright: true
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
# hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

This post will show you how to write a multi-stage Dockerfile and end up with a
very small Docker image with just your application binary.

One of the very interesting things of using a compiled programming language like
Go is that you end up with tiny binaries, which then you can distribute as such.
If combined with Docker you can end up with very tiny images that are faster and
cheaper to distribute.

## TL;DR

A simple Dockerfile with such characteristics would look like this:

    FROM golang:alpine AS builder

    ENV GOOS=linux \
      GO111MODULE=on

    WORKDIR /opt/app

    run apk --no-cache update && \
          apk --no-cache add git ca-certificates && \
          rm -rf /var/cache/apk/*

    COPY go.mod .
    COPY go.sum .

    RUN go mod download

    COPY . ./

    RUN go build -a -o app .

    FROM alpine

    RUN apk --no-cache update && \
          apk --no-cache add ca-certificates && \
          rm -rf /var/cache/apk/*

    COPY --from=builder /opt/app/app /usr/local/bin/app

    CMD ["/usr/local/bin/app", "--help"]

You could copy and paste this into a `Dockerfile` and end up with a fairly small
image and expect to call commands from `/usr/local/bin/app`.

## What is in the Dockerfile and why

Let's start by what's in the first part of the `Dockerfile` and why it's
organized the way it is:

- `GOOS=linux` is declared so it's pretty clear and explicit what kind of OS the
  binary will end up being. I know it seems unnecessary and it may be it, but
  I find explicit better than implicit.
- `GO111MODULE=on` because I like my applications using Go modules and in some
  older versions is not default.
- Declare a `WORKDIR` so there's no question as to where the code should be
  located at.
- Install `git` and `ca-certificates`, because Go modules requires `git` in
  order to clone dependencies and `ca-certificates` so it checks the SSL/TLS
  certs in the connection are valid. I know I said `--no-cache` but I don't love
  the extra empty directory being around my resulting images.
- Copy `go.mod` and `go.sum` before the code, this way they can be cached
  separately and only if there's a change in these files the next step will be
  ran.
- `go mod download`, cached by the previous step.
- Copy my source code and then build.

As the name implies, a multi-stage Dockerfile has several stages, all of which
run in order during a `docker build -t foo .`. We ideally for a Go application
would like a builder and then the final result be copied into a lightweight
image. The base size for an image from `golang:alpine` is over 60 MB, if you're
using Go modules you'll need `git` for cloning during a `go mod download` and
`ca-certificates` if you want to validate the SSL certificates being used are
valid. That's already over 70MB and in most cases I end up with a binary around
8-17MB.

What if I could just copy the binary and run it? That's what the second part
does, so it just:

- Takes the `alpine` image as the start of it.
- Installs `ca-certificates` so we can validate TLS certificates of external
  services.
- Copies the binary from the previous stage (note the use of `--from=builder`).
- Declares a default `CMD` for `--help`.

Why use `alpine` and not `scratch`? Basically because most of the apps I build
end up connecting to external services over TLS, and I really like to make sure
the certificates are valid. Otherwise, using `scratch` is enough and you can
decrease 5MB of the final size.
