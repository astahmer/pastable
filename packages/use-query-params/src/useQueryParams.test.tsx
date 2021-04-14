import { act, renderHook, suppressErrorOutput } from "@testing-library/react-hooks";
import React from "react";
import { MemoryRouter, Route, RouteComponentProps } from "react-router-dom";
import { test } from "uvu";
import assert from "uvu/assert";

import { WithChildren } from "@pastable/typings";
import { parseStringAsBoolean } from "@pastable/utils";

import {
    UseQueryParamsState,
    formatObjToQueryString,
    useCurrentQueryParams,
    useQueryParamsMerger,
    useQueryParamsState,
    useSetQueryParams,
} from "./useQueryParams";

test("formatObjToQueryString", () => {
    assert.equal(formatObjToQueryString({ abc: "123", xyz: "string" }), "?abc=123&xyz=string");
});

test("useCurrentQueryParams returns parsed query params", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const { result } = renderHook(() => useCurrentQueryParams(), { wrapper });
    assert.equal(result.current, { abc: "123", xyz: "string" });
});

test("useCurrentQueryParams format parsed query params using given method", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123,456&xyz=string&bool=true&otherBool=0"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const formater = (value: any) => {
        if (value.includes(",")) return value.split(",");
        const bool = parseStringAsBoolean(value);
        return typeof bool === "boolean" ? bool : value;
    };

    const { result } = renderHook(() => useCurrentQueryParams(formater), { wrapper });
    assert.equal(result.current, {
        abc: ["123", "456"],
        xyz: "string",
        bool: true,
        otherBool: false,
    });
});

test("useQueryParamsMerger merges current parsed query params with values", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const { result } = renderHook(() => useQueryParamsMerger(), { wrapper });
    const merged = result.current({ newParam: "NEW" });
    assert.equal(merged, formatObjToQueryString({ abc: "123", xyz: "string", newParam: "NEW" }));
});

test("useSetQueryParams updates current query params with values", () => {
    const restoreConsole = suppressErrorOutput();

    let testLocation: RouteComponentProps["location"];
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route
                path="*"
                render={({ location }) => {
                    testLocation = location;
                    return children;
                }}
            />
        </MemoryRouter>
    );

    const { result } = renderHook(() => useSetQueryParams(), { wrapper });

    act(() => {
        result.current({ newParam: "NEW" });
    });

    assert.equal(testLocation.search, "?abc=123&xyz=string&newParam=NEW");
    restoreConsole();
});

test("useQueryParamsState allows controlling a query param state from its key", async () => {
    const restoreConsole = suppressErrorOutput();

    let testLocation: RouteComponentProps["location"];
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route
                path="*"
                render={({ location }) => {
                    testLocation = location;
                    return children;
                }}
            />
        </MemoryRouter>
    );

    const { result } = renderHook(
        () =>
            useQueryParamsState<ExampleQueryParams>("abc", {
                getterFormater: (value, key) => (key === "abc" ? Number(value) : value),
            }),
        { wrapper }
    );

    interface ExampleQueryParams {
        abc: number;
        xyz: string;
    }
    const [state, setState] = result.current as UseQueryParamsState<ExampleQueryParams["abc"]>;
    assert.is(state, 123);
    assert.is(typeof setState === "function", true);
    assert.equal(testLocation.search, "?abc=123&xyz=string");

    act(() => {
        setState(456);
    });

    const [updatedState] = result.current;
    assert.equal(updatedState, 456);
    assert.equal(testLocation.search, "?abc=456&xyz=string");

    restoreConsole();
});

test("useQueryParamsState can pass options", async () => {
    const restoreConsole = suppressErrorOutput();

    let testLocation: RouteComponentProps["location"];
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route
                path="*"
                render={({ location }) => {
                    testLocation = location;
                    return children;
                }}
            />
        </MemoryRouter>
    );

    const { result } = renderHook(
        () =>
            useQueryParamsState<ExampleQueryParams>("abc", {
                getterFormater: (value, key) => (key === "abc" ? Number(value) : value),
                setterFormater: (value, key) => (key === "abc" ? Number(value) + 111 : value),
                toPath: "/newPathname",
            }),
        { wrapper }
    );

    interface ExampleQueryParams {
        abc: number;
        xyz: string;
    }
    const [state, setState] = result.current as UseQueryParamsState<ExampleQueryParams["abc"]>;
    assert.is(state, 123);
    assert.is(typeof setState === "function", true);
    assert.equal(testLocation.search, "?abc=123&xyz=string");

    act(() => {
        setState(456);
    });

    const [updatedState] = result.current;
    assert.equal(updatedState, 567);
    assert.equal(testLocation.search, "?abc=567&xyz=string");
    assert.equal(testLocation.pathname, "/newPathname");

    restoreConsole();
});

test.run();
