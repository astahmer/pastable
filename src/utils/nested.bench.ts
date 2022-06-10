import { bench, group, run } from "mitata";
import { ObjectLiteral } from "../typings";
import { set } from "./nested";

const obj = { id: 111, aaa: { bbb: { ccc: { deep: { nested: { prop: 222 } } } } } };

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

    bench("set using prop path string", () => set(obj, path, val));
    bench("set using prop path getter function", () => set(obj, (obj) => obj, "id", val));
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

run();
