import { bench, group, run, baseline } from "mitata";
import { makeArrayOf, uniquesByProp } from "./array";
import { get } from "./nested";
import { getRandomIntIn } from "./random";

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

group("uniquesByProp 1 lvl deep", () => {
    const path = "id";
    // baseline("uniquesByPropV1", () => uniquesByPropV1(arr, path));
    bench("uniquesByProp", () => uniquesByProp(arr, path));
    bench("uniquesByPropWithShortcut", () => uniquesByPropWithShortcut(arr, path));
    bench("uniquesByPropWithJIT", () => uniquesByPropWithJIT(arr, path));
    bench("uniquesByPropWithGetter", () => uniquesByPropWithGetter(arr, (value) => value.id));
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
});

run();
