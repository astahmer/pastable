<h1 align="center">
  📦 A collection of pastable code gathered from past projects
</h1>

<br />

<p align="center">
  <a href="https://codecov.io/gh/astahmer/entity-routes">
    <img
      alt="Code coverage"
      src="https://codecov.io/gh/astahmer/entity-routes/branch/main/graph/badge.svg?token=N0YDUEVIWJ"
    />
  </a>
  <a href="https://twitter.com/astahmer_dev">
    <img
      alt="astahmer_dev Twitter"
      src="https://img.shields.io/twitter/follow/astahmer_dev?label=%40astahmer_dev&style=social"
    />
  </a>
</p>
<br />

## TL;DR

this package is meant mostly for myself.

[API]https://paka.dev/npm/pastable@2.0.13/api

```sh
pnpm i pastable
```

With 1 main & 5 specific entrypoints:

-   `"pastable"`: re-exports everything from utils+typings
-   `"pastable/utils"`
-   `"pastable/react"`
-   `"pastable/typings"`
-   `"pastable/machines"`
-   `"pastable/server"` everything that's commonly used server-side (= no browser APIs + no vendors like react/xstate)

```ts
import { useSelection } from "pastable";

//  or

import { useSelection } from "pastable/react";
```

## ⚡ Motivations

In every project I've been a part of, I've always ended up copy/pasting some part of a previous project that I had made generic, and moving from one project to another I just kept pasting it over and over.

So here we are, I made yet another multi-purpose-utils package !

## 🎨 Code style

It aims to be as generic as possible so that either the source can litteraly be pasted if you just need a couple of functions or you can install any specific package at some point.

100% written in Typescript, near 100% code coverage as a constant goal.

Feel free to contribute if you think there is space for one of your previous projects gems.

## ❤️ Built with

Packages are built with https://preconstruct.tools/ & tested with https://vitest.dev/, special thanks to their authors for those priceless gems !

# Package History

-   [v1 using yarn2 workspaces + custom build scripts](https://github.com/astahmer/pastable/commit/f0f5c0a069f15f4669b976d1f51c7ebe512426d2), had a shitload of single-file packages deployed to npm, each built with https://github.com/developit/microbundle & tested with https://github.com/lukeed/uvu, generated with [plop](https://www.npmjs.com/package/plop)
-   [v2 using pnpm + turborepo](https://github.com/astahmer/pastable/commit/edf6904e041060084920159de04e5889eb4b5425): less packages, still too many folders / complexity, spent way too much time making it work in any env (browser, server, both like when using earlier version of NextJS..)
-   [v3 (current) using pnpm + preconstruct](https://github.com/astahmer/pastable/commit/5542e1cd095dd26bf09aa8ef6d4f829f366db51d): flattened lots of folders, let preconstruct do the hard work, removed shitty react unit tests, deadcode, outdateds demo/docs sites, removed `@` alias to simplify the publish process, replaced uvu by vitest
