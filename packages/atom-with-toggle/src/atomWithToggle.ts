import { PrimitiveAtom, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export function atomWithToggle(
    initialValue?: boolean,
    createAtom: (initialValue: boolean) => PrimitiveAtom<boolean> = atom
): WritableAtom<boolean, boolean | undefined> {
    const effectAtom = createAtom(initialValue || false);
    const anAtom: any = atom(initialValue, (get, set, state?: boolean) => {
        const update = state ?? !get(anAtom);
        set(anAtom, update);
        set(effectAtom, update);
    });
    return anAtom;
}

export function atomWithToggleStored(
    key: string,
    initialValue?: boolean,
    storage?: any
): WritableAtom<boolean, boolean | undefined> {
    return atomWithToggle(initialValue, (initial) => atomWithStorage(key!, initial, storage));
}
