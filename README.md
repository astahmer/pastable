# pastable

_A collection of pastable code gathered from past projects._

## Package list

### Bundle packages:

-   [core](./packages/core/README.md): Re-exports all `pastable` packages.
-   [react](./packages/react/README.md): Re-exports all `pastable` react related packages.

### Common packages :

-   [typings](./packages/typings/README.md): A bunch of utility types. Some are react related.
-   [utils](./packages/utils/README.md): A collection of very short utils functions for about anything, without depenencies. Something like a (very) tiny (incomplete) nicely typed lodash.

### React packages

-   [use-click-away](./packages/use-click-away/README.md): Detect and invoke a callback when clicking away of target element.
-   [use-event](./packages/use-event/README.md): Define an event listener on window or a given element declaratively
-   [use-force-update](./packages/use-force-update/README.md): One liner to force a re-render when needed
-   [use-is-mounted](./packages/use-is-mounted/README.md): Keep track of a component mounted using ref/state.
-   [use-query-params](./packages/use-query-params/README.md): Allows you to get/set page history with query params, usable like a useState.
-   [use-selection](./packages/use-selection/README.md): Like if useState had a child with Array. Makes it easy to work with an array of objects with all the actions available.
-   [use-update-effect](./packages/use-update-effect/README.md): React effect hook that invokes only on update. (taken from chakra-ui)

## Motivations

In every project I've been a part of, I've always ended up copy/pasting some part of a previous project that I had made generic, and moving from one project to another I just kept pasting it over and over.

So here we are, I made yet another multi-purpose-utils package !

## Code style

It aims to be as generic as possible so that either the source can litteraly be pasted if you just need a couple of functions or you can install any specific package at some point.

100% written in Typescript, near 100% code coverage as a constant goal.

Feel free to contribute if you think there is space for one of your previous projects gems.

## Built with

The repo is a Yarn 2 monorepo for now, that might change since it doesn't support ESM, idk yet.

Packages are built with https://github.com/developit/microbundle & tested with https://github.com/lukeed/uvu, special thanks to their authors for those priceless gems !
