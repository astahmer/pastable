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

This package is meant mostly for myself, anything should be pastable from `src` .

```sh
pnpm i pastable
```

With 1 main & 3 specific entrypoints:

-   `"pastable"`: re-exports everything from utils/react/typings
-   `"pastable/utils"`
-   `"pastable/react"`
-   `"pastable/typings"`

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

Packages are built with https://github.com/developit/microbundle & tested with https://github.com/lukeed/uvu, special thanks to their authors for those priceless gems !
