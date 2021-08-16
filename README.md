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

## ⏩ [pastable](http://pastable.vercel.app/): TL;DR

```sh
npm i @pastable/utils @pastable/react
```

(or just `npm i @pastable/core` which is almost the same)

## 📦 Package list

-   [🧰 core](./packages/core/README.md): Re-exports all `pastable` packages.
-   [⚛️ react](./packages/react/README.md): Re-exports all `pastable` react related packages.
-   [📜 typings](./packages/typings/README.md): A bunch of utility types.
-   [⚙️ utils](./packages/utils/README.md): A collection of very short utils functions for about anything, without dependencies. Something like a (very) tiny (incomplete) nicely typed lodash. Contains utils for : `array`, `asserts`, `getters`, `misc`, `nested`, `object`, `pick`, `primitives`, `random`, `set`

### ⚛️ React package contains

-   [atomWithToggle](./docs/atomWithToggle.md): [Jotai](https://github.com/pmndrs/jotai) specific. Like if useToggle & useAtom & useLocalStorage had a child.
-   [useClickAway](./docs/useClickAway.md): Detect and invoke a callback when clicking away of target element.
-   [useEvent](./docs/useEvent.md): Define an event listener on window or a given element declaratively
-   [useForceUpdate](./docs/useForceUpdate.md): One liner to force a re-render when needed
-   [useIsMounted](./docs/useIsMounted.md): Keep track of a component mounted using ref/state.
-   [useQueryParams](./docs/useQueryParams.md): Allows you to get/set page history with query params, usable like a useState.
-   [useSelection](./docs/useSelection.md): Like if useState had a child with Array. Makes it easy to work with an array of objects with all the actions available.
-   [useUpdateEffect](./docs/useUpdateEffect.md): React effect hook that invokes only on update. (taken from chakra-ui)
-   [usePreloadImages](./docs/usePreloadImages.md): Preload images urls so they can appear instantly when needed

## ⚡ Motivations

In every project I've been a part of, I've always ended up copy/pasting some part of a previous project that I had made generic, and moving from one project to another I just kept pasting it over and over.

So here we are, I made yet another multi-purpose-utils package !

## 🎨 Code style

It aims to be as generic as possible so that either the source can litteraly be pasted if you just need a couple of functions or you can install any specific package at some point.

100% written in Typescript, near 100% code coverage as a constant goal.

Feel free to contribute if you think there is space for one of your previous projects gems.

## ❤️ Built with

The repo is a Yarn 2 monorepo for now, that might change since it doesn't support ESM, idk yet.

Packages are built with https://github.com/developit/microbundle & tested with https://github.com/lukeed/uvu, special thanks to their authors for those priceless gems !
