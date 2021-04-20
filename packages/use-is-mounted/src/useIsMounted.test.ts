import { renderHook } from "@testing-library/react-hooks";
import { test } from "uvu";
import assert from "uvu/assert";

import { useIsMounted, useIsMountedRef } from "./useIsMounted";

test("useIsMountedRef", () => {
    const { result, unmount } = renderHook(() => useIsMountedRef());

    assert.equal(result.current.current, true);
    unmount();
    assert.equal(result.current.current, false);
});

test("useIsMounted", () => {
    let isMountedStates: boolean[] = [];
    const { result } = renderHook(() => {
        const isMounted = useIsMounted();
        isMountedStates.push(isMounted);
        return isMounted;
    });

    assert.equal(isMountedStates, [false, true]);
    assert.equal(result.current, true);
});

test.run();
