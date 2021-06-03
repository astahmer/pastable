import { act, renderHook, suppressErrorOutput } from "@testing-library/react-hooks";
import { test } from "uvu";
import assert from "uvu/assert";

import { setupJSDOM } from "@pastable/test-utils";
import { parseStringAsBoolean } from "@pastable/utils";

import {
    formatObjToQueryString,
    useCurrentQueryParams,
    useQueryParamsMerger,
    useQueryParamsState,
    useSetQueryParams,
} from "../src/useQueryParams";

test("formatObjToQueryString", () => {
    assert.equal(formatObjToQueryString({ abc: "123", xyz: "string" }), "?abc=123&xyz=string");
});

test("useCurrentQueryParams returns parsed query params", () => {
    const cleanup = setupJSDOM({ url: "/test?abc=123&xyz=string" });

    const { result } = renderHook(() => useCurrentQueryParams());
    assert.equal(result.current, { abc: "123", xyz: "string" });

    cleanup();
});

test("useCurrentQueryParams format parsed query params using given method", () => {
    const cleanup = setupJSDOM({ url: "/test?abc=123,456&xyz=string&bool=true&otherBool=0" });

    const formater = (value: any) => {
        if (value.includes(",")) return value.split(",");
        const bool = parseStringAsBoolean(value);
        return typeof bool === "boolean" ? bool : value;
    };

    const { result } = renderHook(() => useCurrentQueryParams(formater));
    assert.equal(result.current, {
        abc: ["123", "456"],
        xyz: "string",
        bool: true,
        otherBool: false,
    });

    cleanup();
});

test("useQueryParamsMerger merges current parsed query params with values", () => {
    const cleanup = setupJSDOM({ url: "/test?abc=123&xyz=string" });

    const { result } = renderHook(() => useQueryParamsMerger());
    const merged = result.current({ newParam: "NEW" });
    assert.equal(merged, formatObjToQueryString({ abc: "123", xyz: "string", newParam: "NEW" }));

    cleanup();
});

test("useSetQueryParams updates current query params with values", () => {
    const restoreConsole = suppressErrorOutput();
    const cleanup = setupJSDOM({ url: "/test?abc=123&xyz=string" });

    const testLocation = window.location;

    const { result } = renderHook(() => useSetQueryParams());

    act(() => {
        result.current({ newParam: "NEW" });
    });

    assert.equal(testLocation.search, "?abc=123&xyz=string&newParam=NEW");
    restoreConsole();
    cleanup();
});

test("useQueryParamsState allows controlling a query param state from its key", async () => {
    const restoreConsole = suppressErrorOutput();
    const cleanup = setupJSDOM({ url: "/test?abc=123&xyz=string" });

    const testLocation = window.location;

    const { result, rerender } = renderHook(() =>
        useQueryParamsState<number>("abc", {
            getterFormater: (value, key) => (key === "abc" ? Number(value) : value),
        })
    );

    interface ExampleQueryParams {
        abc: number;
        xyz: string;
    }
    const [state, setState] = result.current;
    assert.is(state, 123);
    assert.is(typeof setState === "function", true);
    assert.equal(testLocation.search, "?abc=123&xyz=string");

    act(() => {
        setState(456);
    });

    rerender();

    const [updatedState] = result.current;
    assert.equal(updatedState, 456);
    assert.equal(testLocation.search, "?abc=456&xyz=string");

    restoreConsole();
    cleanup();
});

test("useQueryParamsState can pass options", async () => {
    const restoreConsole = suppressErrorOutput();
    const cleanup = setupJSDOM({ url: "/test?abc=123&xyz=string" });

    const testLocation = window.location;

    const { result, rerender } = renderHook(() =>
        useQueryParamsState<number>("abc", {
            getterFormater: (value, key) => (key === "abc" ? Number(value) : value),
            setterFormater: (value, key) => (key === "abc" ? Number(value) + 111 : value),
            toPath: "/newPathname",
        })
    );

    interface ExampleQueryParams {
        abc: number;
        xyz: string;
    }
    const [state, setState] = result.current;
    assert.is(state, 123);
    assert.is(typeof setState === "function", true);
    assert.equal(testLocation.search, "?abc=123&xyz=string");

    act(() => {
        setState(456);
    });

    rerender();

    const [updatedState] = result.current;
    assert.equal(updatedState, 567);
    assert.equal(testLocation.search, "?abc=567&xyz=string");
    assert.equal(testLocation.pathname, "/newPathname");

    restoreConsole();
    cleanup();
});

test.run();
