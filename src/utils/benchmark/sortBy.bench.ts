import { baseline, bench, group, run } from "mitata";
import { AnyFunction, ObjectLiteral } from "../../typings";
import { get, makeGetter } from "../../utils";
import { compareBasic, makeArrayOf, SortDirection } from "../array";
import { getRandomIntIn } from "../random";

const makeNestedObj = () => ({
    id: getRandomIntIn(0, 10000),
    aaa: { bbb: { ccc: { deep: { nested: { prop: getRandomIntIn(0, 10000) } } } } },
});
const arr = makeArrayOf(10000).map(makeNestedObj);

function sortByV1<T extends ObjectLiteral, K extends keyof T | (string & {})>(
    arr: T[],
    key: K,
    dir: SortDirection = "asc"
) {
    let aProp;
    let bProp;
    const clone = [...arr];
    clone.sort(function (left, right) {
        aProp = get(left, key as string) || "";
        // @ts-ignore
        aProp = aProp.toLowerCase ? aProp.toLowerCase() : aProp;
        bProp = get(right, key as string) || "";
        // @ts-ignore
        bProp = bProp.toLowerCase ? bProp.toLowerCase() : bProp;

        if (typeof aProp === "string" && typeof bProp === "string") {
            return dir === "asc" ? aProp.localeCompare(bProp) : bProp.localeCompare(aProp);
        }

        if (aProp === bProp) {
            return 0;
        } else if (aProp < bProp) {
            return dir === "asc" ? -1 : 1;
        } else if (aProp > bProp) {
            return dir === "asc" ? 1 : -1;
        }
    });

    return clone;
}

function sortByV2<T extends ObjectLiteral, K extends keyof T | (string & {})>(
    arr: T[],
    key: K,
    dir: SortDirection = "asc"
) {
    let aProp;
    let bProp;
    const clone = [...arr];
    const getter = makeGetter(key as string);

    clone.sort(function (left, right) {
        aProp = getter(left) || "";
        // @ts-ignore
        aProp = aProp.toLowerCase ? aProp.toLowerCase() : aProp;
        bProp = getter(right) || "";
        // @ts-ignore
        bProp = bProp.toLowerCase ? bProp.toLowerCase() : bProp;

        if (!aProp && !bProp) return 0;
        if (!aProp) return -1;
        if (!bProp) return 1;

        if (typeof aProp === "string" && typeof bProp === "string") {
            return dir === "asc" ? aProp.localeCompare(bProp) : bProp.localeCompare(aProp);
        }

        if (aProp instanceof Date && bProp instanceof Date) {
            return dir === "asc"
                ? compareBasic(aProp.getTime(), bProp.getTime())
                : compareBasic(bProp.getTime(), aProp.getTime());
        }

        if (aProp === bProp) {
            return 0;
        }

        if (aProp < bProp) {
            return dir === "asc" ? -1 : 1;
        }

        return dir === "asc" ? 1 : -1;
    });

    return clone;
}

group("get 1 lvl deep", () => {
    const path = "id";

    bench("sortBy v1 using prop key string", () => sortByV1(arr, path));
    bench("sortBy v2 using prop key string / re-using getter", () => sortByV2(arr, path));
});

group("get deeply nested prop", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";
    bench("sortBy v1 using prop dot-delimited path string", () => sortByV1(arr, path));
    bench("sortBy v2 using prop dot-delimited path string / re-using getter", () => sortByV2(arr, "aaa.c"));
});

run();
