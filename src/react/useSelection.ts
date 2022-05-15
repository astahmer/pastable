import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";

import { sortBy as sortByFn } from "../utils";

export function useSelection<T = any, Id = string | number>({
    getId,
    max,
    initial = [],
    sortBy: sortByProp,
    sortDirection = "asc",
    sortFn: sortFnProp,
    updateFromInitial,
    onUpdate,
}: UseSelectionProps<T, Id>): Selection<T> {
    const [selected, setSelected] = useState(initial);

    const set = (value: SetStateAction<T[]>) => {
        setSelected(value);

        if (onUpdate) {
            const current = typeof value === "function" ? value(selected) : value;
            onUpdate(current);
        }
    };

    const add = (item: T | T[]) => {
        let clone = Array.isArray(item) ? [...item] : { ...item };
        if (max) {
            if (selected.length >= max) {
                return;
            }
            if (Array.isArray(item)) {
                clone = item.slice(0, max - selected.length);
            }
        }

        set(selected.concat(clone));
    };

    const remove = (indexOrItem: number | T) => {
        let index = indexOrItem;
        if (typeof indexOrItem !== "number") {
            index = find(indexOrItem, true);
        }

        const clone = [...selected];
        clone.splice(index as number, 1);
        set([...clone]);
    };
    const clear = () => set([]);

    const find = <ReturnIndex extends boolean = false>(
        item: T,
        returnIndex?: ReturnIndex
    ): ReturnIndex extends true ? number : T =>
        selected[returnIndex ? "findIndex" : "find"]((selectedItem) => getId(selectedItem) === getId(item)) as any;
    const findById = <ReturnIndex extends boolean = false>(
        id: ReturnType<UseSelectionProps<T, Id>["getId"]>,
        returnIndex?: ReturnIndex
    ): ReturnIndex extends true ? number : T =>
        selected[returnIndex ? "findIndex" : "find"]((selectedItem) => getId(selectedItem) === id) as any;

    const has = (item: T) => find(item) !== undefined;
    const update = (item: T) => {
        set((items) => {
            const index = find(item, true);
            const clone = [...items];
            clone[index] = item;
            return clone;
        });
    };
    const upsert = (item: T) => (has(item) ? update(item) : add(item));

    const toggle = (item: T) => {
        const hasItem = has(item);
        if (hasItem) {
            remove(item);
        } else {
            add(item);
        }
        return hasItem;
    };

    const sortBy = (compareFn: (a: T, b: T) => number) => {
        set((current) => [...current].sort(compareFn));
    };
    const sorted = useMemo(() => {
        if (sortByProp) {
            return sortByFn(selected, sortByProp as keyof T & string, sortDirection);
        } else if (sortFnProp) {
            return [...selected].sort(sortFnProp);
        } else {
            return selected;
        }
    }, [selected, sortByProp, sortFnProp]);
    const get = () => sorted;

    const initialSelection = useMemo(() => initial, [initial]);
    const reset = () => set(initial);

    // Update selection when initial or trigger changes
    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!isMountedRef.current) return;
        if (updateFromInitial) {
            set(initialSelection);
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [initialSelection, updateFromInitial]);

    return [sorted, { get, set, clear, reset, add, remove, find, findById, has, toggle, update, upsert, sortBy }];
}

export type UseSelectionProps<T = any, Id = string | number> = {
    /** Main (& required !) option, defines how to access a property that will be unique to each items */
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
    onUpdate?: (value: T[]) => void;
    /** Defines a maximum selection length, if trying to add items when max is always reached, they will be ignored */
    max?: number;
};

export type SelectionActions<T = any, Id = any> = {
    get: () => T[];
    set: Dispatch<SetStateAction<T[]>>;
    clear: () => void;
    reset: () => void;
    add: (item: T | T[]) => void;
    remove: (indexOrItem: number | T) => void;
    find: <ReturnIndex extends boolean = false>(
        item: T,
        returnIndex?: ReturnIndex
    ) => ReturnIndex extends true ? number : T;
    findById: <ReturnIndex extends boolean = false>(
        id: ReturnType<UseSelectionProps<T, Id>["getId"]>,
        returnIndex?: ReturnIndex
    ) => ReturnIndex extends true ? number : T;
    has: (item: T) => boolean;
    toggle: (item: T) => boolean;
    update: (item: T) => void;
    upsert: (item: T) => void;
    sortBy: (compareFn: (a: T, b: T) => number) => void;
};
export type Selection<T = any, Id = any> = [T[], SelectionActions<T, Id>];
