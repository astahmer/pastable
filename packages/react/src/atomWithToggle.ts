import { PrimitiveAtom, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export function atomWithToggle(
    initialValue?: boolean,
    createAtom: (initialValue: boolean) => PrimitiveAtom<boolean> = atom
): WritableAtom<boolean, boolean | undefined> {
    const anAtom = createAtom(initialValue!);
    const derivedAtom = atom(
        (get) => get(anAtom),
        (get, set, nextValue?: boolean) => {
            const update = nextValue ?? !get(anAtom);
            set(anAtom, update);
        }
    );
    return derivedAtom as WritableAtom<boolean, boolean | undefined>;
}

export function atomWithToggleAndStorage(
    key: string,
    initialValue?: boolean,
    storage?: any
): WritableAtom<boolean, boolean | undefined> {
    return atomWithToggle(initialValue, (initial) => atomWithStorage(key!, initial, storage));
}
