---
title: Versioning Terraform modules without a registry, but Git
date: date
tags:
  - Terraform
categories:
  - Terraform
---

Let's say your organization made the sane decision to keep re-usable Terraform modules in the same Git repository and now developers are expected to reference them. Yet, your organization is not expecting to use a Terraform registry, but instead, the expectation is to use the Git repository directly as the source, like:

```terraform
module "name" {
    source = "git@github.com/org/mods.git//mod-a"
}
```

With a repository structure like this:

```console
tree -L 1
.
├── mod-a
├── mod-b
└── mod-c
```

Shipping re-usable things in organizations can be troublesome. Different teams re-use the resource and then you are left with pieces of a platform using different versions of the same resource. Without proper versioning, it's a train-crash awaiting to happen. And native Terraform modules versioning is only available when the source is a registry.

Git `ref`s to the rescue.

Terraform is implicitly including the `ref` in your source address when using Git, with the name of your default branch. This value can be found by doing

```console
git remote show origin | grep 'HEAD branch'
  HEAD branch: main
```

Your results may vary, depending on what's the name of your default branch.

Now, this means we can use tags for our versioning, which may come useful since now sources could be very specific, like:

```terraform
module "name" {
    source = "git@github.com/org/mods.git//mod-a?ref=v1.0.0"
}
```

But then you'll be missing out on future updates and fixes.

The workaround is to combine tags and branches, since branches are references just like tags are.

The main requirement is to enforce a strict semantic versioning policy in your repository and making base branches where tags are merged to.

In order to reduce manual-labor, I would suggest to only keep branches for the major version, it would look something like this:

```

  tags           v1.0.0/v1.0.1      v1.1.0       v2.0.0       v2.1.0
┌──────┐
│ main ├───▪────▪───▫──▪───▫────▪───▪──▫──▪──▪──▪───▫──▪────▪────▫─────▶
└──────┘            │      │           │            │            │
                    │      │           │            │            │
┌──────┐            ▼      ▼           ▼            │            │
│  v1  ├────────────▪──────▪───────────▪────────────┼────────────┼─────▶
└──────┘                                            │            │
                                                    │            │
┌──────┐                                            ▼            ▼
│  v2  ├────────────────────────────────────────────▪────────────▪─────▶
└──────┘
```

And when defining the source of the module, looks like:

```terraform
module "name" {
    source = "git@github.com/org/mods.git//mod-a?ref=v1"
}
```

With this, each time `mod-a` is applied, it'll be having the latest version of the module release.

Although there's a `v2` branch in the diagram above, it's simpler to create major breaking versions as a new module, like `mod-a-v2`. This reduces friction during development.

This approach also helps to ease development, by referencing branches and using it for experimental features. Be warned though, the `ref` argument gets lost when the value has `/` in it. Using names of branches like `feat/name` is not possible, it'll try `feat`.
