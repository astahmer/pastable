# @pastable/atom-with-toggle

Like if useToggle & useAtom & useLocalStorage had a child.

## Dependencies

-   react/[jotai](https://github.com/pmndrs/jotai)

## Install

```sh
yarn add @pastable/atom-with-toggle
```

or

```sh
npm i @pastable/atom-with-toggle
```

## Motivation

I find myself duplicating this behaviour a lot across projects, having to setup an atom and then a `toggle` function, like I would with a basic useState, so here's a little helper that could come handy.

[Original PR](https://github.com/pmndrs/jotai/pull/483)

## Usage

It supports 3 optional args:

-   `initialState`: boolean
-   `key`: string, if present the boolean state will be saved in storage (using `atomWithStorage`)
-   `storage`: Storage, the type of storage to pass to `atomWithStorage`

It returns an atom with `[boolean, toggleFn]`, the `toggleFn` can have an optional arg to force a particular state (if you want to make a `setActive` function out of it for example)

Example:

```ts
import { atomWithToggle } from "jotai/utils";

// [...]

const withTwitchChatAtom = atomWithToggle(!isDev(), "coro/withTwitchChat");

// In a React component
const [withTwitchChat, toggleWithTwitchChat] = useAtom(withTwitchChatAtom);

// in the render

<Button onClick={() => toggleWithTwitchChat()}>Twitch Chat {withTwitchChat + ""}</Button>;
```
