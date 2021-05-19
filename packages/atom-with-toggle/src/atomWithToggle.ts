import { WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export function atomWithToggle(
    initialValue?: boolean,
    key?: string,
    storage?: any
): WritableAtom<boolean, boolean | undefined> {
    const storeAtom = key ? atomWithStorage(key, initialValue!, storage) : null;
    const anAtom: any = atom(initialValue, (get, set, state?: boolean) => {
        const update = state ?? !get(anAtom);
        set(anAtom, update);
        storeAtom && set(storeAtom, update);
    });
    return anAtom;
}
