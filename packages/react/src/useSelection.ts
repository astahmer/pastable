import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { sortBy as sortByFn } from "@pastable/utils";

import { useIsMountedRef } from "./useIsMounted";
import { useUpdateEffect } from "./useUpdateEffect";

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
    const isMountedRef = useIsMountedRef();

    const set = useCallback(
        (value: SetStateAction<T[]>) => {
            if (!isMountedRef.current) return;
            setSelected(value);
            onUpdate?.(value);
        },
        [onUpdate]
    );

    const add = useCallback(
        (item: T | T[]) => {
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
        },
        [selected, max]
    );

    const remove = useCallback(
        (indexOrItem: number | T) => {
            let index = indexOrItem;
            if (typeof indexOrItem !== "number") {
                index = find(indexOrItem, true);
            }

            const clone = [...selected];
            clone.splice(index as number, 1);
            set([...clone]);
        },
        [selected]
    );
    const clear = useCallback(() => set([]), []);

    const find = useCallback(
        <ReturnIndex extends boolean = false>(
            item: T,
            returnIndex?: ReturnIndex
        ): ReturnIndex extends true ? number : T =>
            selected[returnIndex ? "findIndex" : "find"]((selectedItem) => getId(selectedItem) === getId(item)) as any,
        [selected]
    );
    const findById = useCallback(
        <ReturnIndex extends boolean = false>(
            id: ReturnType<UseSelectionProps<T, Id>["getId"]>,
            returnIndex?: ReturnIndex
        ): ReturnIndex extends true ? number : T =>
            selected[returnIndex ? "findIndex" : "find"]((selectedItem) => getId(selectedItem) === id) as any,
        [selected]
    );

    const has = useCallback((item: T) => find(item) !== undefined, [selected]);
    const update = (item: T) => {
        set((items) => {
            const index = find(item, true);
            const clone = [...items];
            clone[index] = item;
            return clone;
        });
    };
    const upsert = (item: T) => (has(item) ? update(item) : add(item));

    const toggle = useCallback(
        (item: T) => {
            const hasItem = has(item);
            if (hasItem) {
                remove(item);
            } else {
                add(item);
            }
            return hasItem;
        },
        [selected]
    );

    const sortBy = useCallback((compareFn: (a: T, b: T) => number) => {
        set((current) => [...current].sort(compareFn));
    }, []);
    const sorted = useMemo(() => {
        if (sortByProp) {
            return sortByFn(selected, sortByProp as keyof T & string, sortDirection);
        } else if (sortFnProp) {
            return [...selected].sort(sortFnProp);
        } else {
            return selected;
        }
    }, [selected, sortByProp, sortFnProp]);
    const get = useCallback(() => sorted, [sorted]);

    const initialSelection = useMemo(() => initial, [initial]);
    const reset = useCallback(() => set(initial), [initial]);

    // Update selection when initial or trigger changes
    useUpdateEffect(() => {
        if (updateFromInitial) {
            set(initialSelection);
        }
    }, [initialSelection, updateFromInitial]);

    return [
        sorted,
        { get, set, clear, reset, add, remove, find, findById, has, toggle, update, upsert, sortBy: sortBy },
    ];
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
    onUpdate?: (value: SetStateAction<T[]>) => void;
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
