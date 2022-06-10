import { baseline, bench, group, run } from "mitata";
import { AnyFunction, ObjectLiteral } from "../../typings";
import { get } from "../nested";

const obj = { id: 111, aaa: { bbb: { ccc: { deep: { nested: { prop: 222 } } } } } };

function getV1<Return = any, From = ObjectLiteral>(obj: From, path: string): Return {
    let target = obj || {};
    const props = path.split(".");
    for (let i = 0, len = props.length; i < len; ++i) {
        target = target[props[i] as keyof typeof target];
        if (target === undefined || target === null) {
            break;
        }
    }

    return target as Return;
}

const getWithShortcut = <Return = any, From = ObjectLiteral>(obj: From, path: string) => {
    if (path.includes(".")) {
        let target = obj || {};
        const props = path.split(".");
        for (let i = 0, len = props.length; i < len; ++i) {
            target = target[props[i] as keyof typeof target];
            if (target === undefined || target === null) {
                break;
            }
        }

        return target as Return;
    }
    return (obj as any)[path];
};

const getWithGetter = <Return = any, From = ObjectLiteral>(obj: From, getter: (value: From) => any, prop: string) => {
    const parent = getter(obj);
    if (parent) {
        return parent[prop] as Return;
    }
};

const getWithJIT = <Return = any, From = ObjectLiteral>(obj: From, path: string) => {
    if (path.includes(".")) {
        const getter = new Function("obj", "propPath", "value", "return obj." + path);
        return getter(obj, path) as Return;
    }

    return (obj as any)[path];
};

const makeGetterJIT = <Return = any, From = ObjectLiteral>(path: string): ((obj: From) => Return) => {
    if (path.includes(".")) {
        return new Function("obj", "propPath", "value", "return obj." + path) as AnyFunction<Return, From>;
    }

    return (obj: From) => (obj as any)[path] as Return;
};

const getWithSafeJIT = <Return = any, From = ObjectLiteral>(obj: From, path: string) => {
    if (path.includes(".")) {
        const parts = ("obj." + path).split(".");
        const getter = new Function(
            "obj",
            "propPath",
            "value",
            `return ${parts.slice(0, parts.length - 1).join("?.")}`
        );
        return getter(obj, path) as Return;
    }

    return (obj as any)[path] as Return;
};

const getWithGetterJIT = <Return = any, From = ObjectLiteral>(obj: From, path: string) => {
    if (path.includes(".")) {
        const parts = path.split(".");
        const getter = new Function("obj", "propPath", "return obj." + parts.slice(0, parts.length - 1).join("."));
        const parent = getter(obj, path);
        if (parent) {
            return parent[parts[parts.length - 1]] as Return;
        }
    }

    return (obj as any)[path] as Return;
};

const val = "12345";

group("get 1 lvl deep", () => {
    const path = "id";

    // baseline("getV1", () => getV1(obj, path));
    // baseline("classic prop accessor without fn", () => obj.id);
    bench("get using prop path string", () => get(obj, path));
    // bench("get using prop path getter function", () => get(obj, (obj) => obj.id));
    bench("getWithShortcut", () => getWithShortcut(obj, path));
    bench("getWithJIT", () => getWithJIT(obj, path));
    bench("getWithSafeJIT", () => getWithSafeJIT(obj, path));
    bench("getWithGetterJIT", () => getWithGetterJIT(obj, path));
    bench("getWithGetter", () => getWithGetter(obj, (value) => value, path));
    bench("getWithGetterHoistedFn", () =>
        getWithGetter(
            obj,
            function (value) {
                return value;
            },
            "prop"
        )
    );
});

group("get deeply nested prop", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";

    // baseline("getV1", () => getV1(obj, path));
    // baseline("classic prop accessor without fn", () => obj.aaa.bbb.ccc.deep.nested.prop);
    bench("get using prop path string", () => get(obj, path));
    // bench("get using prop path getter function", () => get(obj, (obj) => obj.aaa.bbb.ccc.deep.nested.prop));
    bench("getWithShortcut", () => getWithShortcut(obj, path));
    bench("getWithJIT", () => getWithJIT(obj, path));
    bench("getWithSafeJIT", () => getWithSafeJIT(obj, path));
    bench("getWithGetterJIT", () => getWithGetterJIT(obj, path));
    bench("makeGetterJIT", () => makeGetterJIT(path)(obj));
    bench("getWithGetter", () => getWithGetter(obj, (value) => value.aaa.bbb.ccc.deep.nested, "prop"));
    bench("getWithSafeGetter", () => getWithGetter(obj, (value) => value?.aaa?.bbb?.ccc?.deep?.nested, "prop"));
    bench("getWithGetterHoistedFn", () =>
        getWithGetter(
            obj,
            function (value) {
                return value.aaa.bbb.ccc.deep.nested;
            },
            "prop"
        )
    );
});

group("get deeply nested prop - with reused fns", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";
    const basicJit = new Function("obj", "propPath", "return obj." + path);

    const get0 = () => basicJit(obj, path);
    const get1 = () => get(obj, path);
    // const get2 = () => get(obj, (obj) => obj.aaa.bbb.ccc.deep.nested);
    const get3 = () => getWithShortcut(obj, path);
    const get4 = () => getWithJIT(obj, path);
    const get5 = () => getWithSafeJIT(obj, path);
    const get6 = () => getWithGetterJIT(obj, path);
    const get7 = () => getWithGetter(obj, (value) => value.aaa.bbb.ccc.deep.nested, "prop");
    const get8 = () => getWithGetter(obj, (value) => value?.aaa?.bbb?.ccc?.deep?.nested, "prop");
    const get9 = () =>
        getWithGetter(
            obj,
            function (value) {
                return value.aaa.bbb.ccc.deep.nested.prop;
            },
            "prop"
        );

    const getterJIT = makeGetterJIT(path);

    // baseline("getV1", () => getV1(obj, path));
    // baseline("classic prop assignment without fn", () => {
    //     obj.aaa.bbb.ccc.deep.nested.prop = val as any;
    // });
    bench("basic jit", () => void new Function("obj", "propPath", "return obj." + path)(obj, path));
    bench("basic reused jit", get0);
    bench("get using prop path string", get1);
    // bench("get using prop path getter function", get2);
    bench("getWithShortcut", get3);
    bench("getWithJIT", get4);
    bench("getWithSafeJIT", get5);
    bench("getWithGetterJIT", get6);
    bench("makeGetterJIT", () => getterJIT(obj));
    bench("getWithGetter", get7);
    bench("getWithSafeGetter", get8);
    bench("getWithGetterHoistedFn", get9);
});

run();
