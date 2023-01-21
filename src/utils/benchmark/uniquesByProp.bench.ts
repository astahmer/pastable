import { bench, group, run } from "mitata";
import { makeArrayOf, uniques, uniquesByProp } from "../array";
import { get } from "../nested";
import { getRandomIntIn } from "../random";

const arr = makeArrayOf(100000).map((_, i) => ({
    id: getRandomIntIn(0, 10),
    aaa: { bbb: { ccc: { deep: { nested: { prop: getRandomIntIn(0, 10) } } } } },
}));

const uniquesByPropV1 = <T = any>(arr: T[], propPath: string): T[] =>
    arr.reduce(
        (acc, item) => (acc.find((current) => get(current, propPath) === get(item, propPath)) ? acc : acc.concat(item)),
        []
    );

const uniquesByPropWithShortcut = <T = any>(arr: T[], propPath: string): T[] => {
    if (propPath.includes("."))
        return arr.reduce(
            (acc, item) =>
                acc.find((current) => get(current, propPath) === get(item, propPath)) ? acc : acc.concat(item),
            []
        );

    return arr.reduce(
        (acc, item) => (acc.find((current) => current[propPath] === (item as any)[propPath]) ? acc : acc.concat(item)),
        []
    );
};

const uniquesByPropWithJIT = <T = any>(arr: T[], propPath: string): T[] => {
    if (propPath.includes(".")) {
        const getter = new Function("obj", "propPath", "return obj." + propPath);
        return arr.reduce(
            (acc, item) =>
                acc.find((current) => getter(current, propPath) === getter(item, propPath)) ? acc : acc.concat(item),
            []
        );
    }

    return arr.reduce(
        (acc, item) => (acc.find((current) => current[propPath] === (item as any)[propPath]) ? acc : acc.concat(item)),
        []
    );
};

const uniquesByPropWithGetter = <T = any>(arr: T[], getter: (value: T) => any): T[] => {
    return arr.reduce(
        (acc, item) => (acc.find((current) => getter(current) === getter(item)) ? acc : acc.concat(item)),
        []
    );
};

const uniquesByPropV2 = <T = any>(arr: T[], propPathOrGetter: string | ((value: T) => any)): T[] => {
    if (typeof propPathOrGetter === "function") {
        return arr.reduce(
            (acc, item) =>
                acc.find((current) => propPathOrGetter(current) === propPathOrGetter(item)) ? acc : acc.concat(item),
            []
        );
    }

    if (propPathOrGetter.includes(".")) {
        const getter = new Function("obj", "propPath", "return obj." + propPathOrGetter);
        return arr.reduce(
            (acc, item) =>
                acc.find((current) => getter(current, propPathOrGetter) === getter(item, propPathOrGetter))
                    ? acc
                    : acc.concat(item),
            []
        );
    }

    return arr.reduce(
        (acc, item) =>
            acc.find((current) => current[propPathOrGetter] === (item as any)[propPathOrGetter])
                ? acc
                : acc.concat(item),
        []
    );
};

group("uniquesByProp 1 lvl deep", () => {
    const path = "id";
    // baseline("uniquesByPropV1", () => uniquesByPropV1(arr, path));
    bench("uniquesByProp", () => uniquesByProp(arr, path));
    bench("uniquesByPropWithShortcut", () => uniquesByPropWithShortcut(arr, path));
    bench("uniquesByPropWithJIT", () => uniquesByPropWithJIT(arr, path));
    bench("uniquesByPropWithGetter", () => uniquesByPropWithGetter(arr, (value) => value.id));
    bench("uniquesByPropV2 - using a getter", () => uniquesByPropV2(arr, (value) => value.id));
    bench("uniquesByPropV2 - using JIT if propPath is a string", () => uniquesByPropV2(arr, path));
    bench("uniques with map", () => uniques(arr.map((value) => value.id)));
});

group("uniquesByProp deeply nested prop", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";
    // baseline("uniquesByPropV1", () => uniquesByPropV1(arr, path));
    bench("uniquesByProp", () => uniquesByProp(arr, path));
    bench("uniquesByPropWithShortcut", () => uniquesByPropWithShortcut(arr, path));
    bench("uniquesByPropWithJIT", () => uniquesByPropWithJIT(arr, path));
    bench("uniquesByPropWithGetter", () => uniquesByPropWithGetter(arr, (value) => value.aaa.bbb.ccc.deep.nested.prop));
    bench("uniquesByPropWithGetterHoistedFn", () =>
        uniquesByPropWithGetter(arr, function (value) {
            return value.aaa.bbb.ccc.deep.nested.prop;
        })
    );
    bench("uniquesByPropV2 - using a getter", () =>
        uniquesByPropV2(arr, (value) => value.aaa.bbb.ccc.deep.nested.prop)
    );
    bench("uniquesByPropV2 - using JIT if propPath is a string", () => uniquesByPropV2(arr, path));
    bench("uniques with map", () => uniques(arr.map((value) => value.aaa.bbb.ccc.deep.nested.prop)));
});

run();
