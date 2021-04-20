import { act, renderHook } from "@testing-library/react-hooks";
import { test } from "uvu";
import assert from "uvu/assert";

import { useForceUpdate } from "./useForceUpdate";

test("useForceUpdate", () => {
    let rerendersCount = 0;
    const { result } = renderHook(() => {
        rerendersCount++;

        return useForceUpdate();
    });

    assert.equal(rerendersCount, 1);

    act(() => {
        result.current();
    });

    assert.equal(rerendersCount, 2);
});

test.run();
