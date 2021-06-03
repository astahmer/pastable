# @pastable/use-selection

Like if useState had a child with Array. Makes it easy to work with an array of objects with all the actions available.

```ts
const [items, actions] = useSelection({
    getId: (lobby) => lobby.id,
    initial: query.data.items,
    orderBy: (a, z) => new Date(z.createdAt).getTime() - new Date(a.createdAt).getTime(),
});
```

## Usage

`useSelection` returns a tuple of `[selection, actions]`, where `selection` is the current state of the array and `actions` is an object with a lot of methods to manipulate the `selection`.

```ts
export type Selection<T = any, Id = any> = [T[], SelectionActions<T, Id>];
```

**Required:** Your array (selection) should contain a list of objects identifiable from a property.

Pass the `getId` method in the options prop of `useSelection`, this method should return that unique identifier from an item.

Here are the options that you can pass to `useSelection`;

```ts
export type UseSelectionProps<T = any, Id = string | number> = {
    /** Main (& required !) prop, defines how to access a property that will be unique to each items */
    getId: (item: T) => Id;
    /** Initial selection values */
    initial?: T[];
    /** Sort function to apply automatically to selection */
    sortFn?: (a: T, b: T) => number;
    /** An item property from which the selection will be automatically sorted */
    sortBy?: keyof T;
    /** Sort direction, either asc or desc, defaults to asc */
    sortDirection?: "asc" | "desc";
    /** If true, the selection will mirror the initial property */
    updateFromInitial?: boolean;
    /** Callback invoked on any set action */
    onUpdate?: (value: SetStateAction<T[]>) => void;
    /** Defines a maximum selection length, if trying to add items when max is always reached, they will be ignored */
    max?: number;
};
```

And here are the actions available as 2nd return element.

```ts
export type SelectionActions<T = any, Id = any> = {
    get: () => T[];
    set: Dispatch<SetStateAction<T[]>>;
    clear: () => void;
    reset: () => void;
    add: (item: T | T[]) => void;
    remove: (indexOrItem: number | T) => void;
    find: (item: T) => T;
    findById: (id: ReturnType<UseSelectionProps<T, Id>["getId"]>) => T;
    findIndex: (item: T) => number;
    has: (item: T) => boolean;
    toggle: (item: T) => boolean;
    update: (item: T) => void;
    upsert: (item: T) => void;
    sortBy: (compareFn: (a: T, b: T) => number) => void;
};
```
