import { baseline, bench, group, run } from "mitata";
import { ObjectLiteral } from "../../typings";
import { set } from "../nested";

const obj = { id: 111, aaa: { bbb: { ccc: { deep: { nested: { prop: 222 } } } } } };

function setV1<Value = any, From = ObjectLiteral>(
    obj: From,
    pathOrGetter: string | ((obj: From) => any),
    valueOrProp: Value | string,
    value?: Value
): void {
    if (typeof pathOrGetter === "function") {
        const parent = pathOrGetter(obj);
        if (parent) {
            parent[valueOrProp] = value;
        }
        return;
    }

    let target = obj as any;
    const props = pathOrGetter.split(".");
    for (let i = 0, len = props.length; i < len; ++i) {
        if (i + 1 < len) {
            if (target[props[i]] === undefined || target[props[i]] === null) {
                target = target[props[i]] = {};
            } else {
                target = target[props[i]];
            }
        } else {
            target[props[i]] = valueOrProp;
        }
    }
}

const setWithShortcut = <Value = any, From = ObjectLiteral>(obj: From, path: string, value: Value) => {
    if (path.includes(".")) {
        let target = obj as any;
        const props = path.split(".");
        for (let i = 0, len = props.length; i < len; ++i) {
            if (i + 1 < len) {
                if (target[props[i]] === undefined || target[props[i]] === null) {
                    target = target[props[i]] = {};
                } else {
                    target = target[props[i]];
                }
            } else {
                target[props[i]] = value;
            }
        }
        return;
    }

    (obj as any)[path] = value;
};

const setWithGetter = <Value = any, From = ObjectLiteral>(
    obj: From,
    getter: (value: From) => any,
    prop: string,
    value: Value
) => {
    const parent = getter(obj);
    if (parent) {
        parent[prop] = value;
    }
};

const setWithJIT = <Value = any, From = ObjectLiteral>(obj: From, path: string, value: Value) => {
    if (path.includes(".")) {
        const setter = new Function("obj", "propPath", "value", "obj." + path + " = value");
        return setter(obj, path, value);
    }

    (obj as any)[path] = value;
};

const setWithSafeJIT = <Value = any, From = ObjectLiteral>(obj: From, path: string, value: Value) => {
    if (path.includes(".")) {
        const parts = ("obj." + path).split(".");
        const setter = new Function(
            "obj",
            "propPath",
            "value",
            `if (${parts.slice(0, parts.length - 1).join("?.")}) { obj.${path} = value; }`
        );
        return setter(obj, path, value);
    }

    (obj as any)[path] = value;
};

const setWithGetterJIT = <Value = any, From = ObjectLiteral>(obj: From, path: string, value: Value) => {
    if (path.includes(".")) {
        const parts = path.split(".");
        const getter = new Function("obj", "propPath", "return obj." + parts.slice(0, parts.length - 1).join("."));
        const parent = getter(obj, path);
        if (parent) {
            parent[parts[parts.length - 1]] = value;
        }
    }

    (obj as any)[path] = value;
};

const val = "12345";

group("set 1 lvl deep", () => {
    const path = "id";
    const basicJit = new Function("obj", "path", "value", "obj[path] = value");

    baseline("setV1", () => setV1(obj, path, val));
    // baseline("classic prop assignment without fn", () => {
    //     obj[path] = val as any;
    // });
    bench("basic jit", () => void new Function("obj", "path", "value", "obj[path] = value")(obj, path, val));
    bench("basic reused jit", () => void basicJit(obj, path, val));
    bench("set using prop path string", () => set(obj, path, val));
    bench("set using prop path getter function", () => set(obj, (obj) => obj, path, val));
    bench("setWithShortcut", () => setWithShortcut(obj, path, val));
    bench("setWithJIT", () => setWithJIT(obj, path, val));
    bench("setWithSafeJIT", () => setWithSafeJIT(obj, path, val));
    bench("setWithGetterJIT", () => setWithGetterJIT(obj, path, val));
    bench("setWithGetter", () => setWithGetter(obj, (value) => value, path, val));
    bench("setWithGetterHoistedFn", () =>
        setWithGetter(
            obj,
            function (value) {
                return value;
            },
            "prop",
            val
        )
    );
});

group("set deeply nested prop", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";
    const basicJit = new Function("obj", "path", "value", "obj[path] = value");

    // baseline("setV1", () => setV1(obj, path, val));
    // baseline("classic prop assignment without fn", () => {
    //     obj.aaa.bbb.ccc.deep.nested.prop = val as any;
    // });
    bench("basic jit", () => void new Function("obj", "path", "value", "obj[path] = value")(obj, path, val));
    bench("basic reused jit", () => void basicJit(obj, path, val));
    bench("set using prop path string", () => set(obj, path, val));
    bench("set using prop path getter function", () => set(obj, (obj) => obj.aaa.bbb.ccc.deep.nested, "prop", val));
    bench("setWithShortcut", () => setWithShortcut(obj, path, val));
    bench("setWithJIT", () => setWithJIT(obj, path, val));
    bench("setWithSafeJIT", () => setWithSafeJIT(obj, path, val));
    bench("setWithGetterJIT", () => setWithGetterJIT(obj, path, val));
    bench("setWithGetter", () => setWithGetter(obj, (value) => value.aaa.bbb.ccc.deep.nested, "prop", val));
    bench("setWithSafeGetter", () => setWithGetter(obj, (value) => value?.aaa?.bbb?.ccc?.deep?.nested, "prop", val));
    bench("setWithGetterHoistedFn", () =>
        setWithGetter(
            obj,
            function (value) {
                return value.aaa.bbb.ccc.deep.nested.prop;
            },
            "prop",
            val
        )
    );
});

group("set deeply nested prop - with reused fns", () => {
    const path = "aaa.bbb.ccc.deep.nested.prop";
    const basicJit = new Function("obj", "path", "value", "obj[path] = value");

    const set0 = () => basicJit(obj, path, val);
    const set1 = () => set(obj, path, val);
    const set2 = () => set(obj, (obj) => obj, path, val);
    const set3 = () => setWithShortcut(obj, path, val);
    const set4 = () => setWithJIT(obj, path, val);
    const set5 = () => setWithSafeJIT(obj, path, val);
    const set6 = () => setWithGetterJIT(obj, path, val);
    const set7 = () => setWithGetter(obj, (value) => value.aaa.bbb.ccc.deep.nested, "prop", val);
    const set8 = () => setWithGetter(obj, (value) => value?.aaa?.bbb?.ccc?.deep?.nested, "prop", val);
    const set9 = () =>
        setWithGetter(
            obj,
            function (value) {
                return value.aaa.bbb.ccc.deep.nested.prop;
            },
            "prop",
            val
        );

    // baseline("setV1", () => setV1(obj, path, val));
    // baseline("classic prop assignment without fn", () => {
    //     obj.aaa.bbb.ccc.deep.nested.prop = val as any;
    // });
    bench("basic jit", () => void new Function("obj", "path", "value", "obj[path] = value")(obj, path, val));
    bench("basic reused jit", set0);
    bench("set using prop path string", set1);
    bench("set using prop path getter function", set2);
    bench("setWithShortcut", set3);
    bench("setWithJIT", set4);
    bench("setWithSafeJIT", set5);
    bench("setWithGetterJIT", set6);
    bench("setWithGetter", set7);
    bench("setWithSafeGetter", set8);
    bench("setWithGetterHoistedFn", set9);
});

run();
