import { fireEvent, render } from "@testing-library/react";
import React, { useRef } from "react";
import { test } from "uvu";
import assert from "uvu/assert";

import { setupJSDOM } from "@pastable/test-utils";

import { useClickAway } from "./useClickAway";

test("useClickAway invokes a callback when clicking away of target element.", async () => {
    const cleanup = setupJSDOM();

    let clickedOutside = false;
    const TestUseClickAway = () => {
        const targetRef = useRef();

        useClickAway(targetRef, () => (clickedOutside = true));

        return (
            <>
                <div ref={targetRef}>
                    <span>inside</span>
                    <span>another</span>
                </div>
                <div>outside</div>
            </>
        );
    };

    const result = render(<TestUseClickAway />);

    assert.equal(clickedOutside, false);
    fireEvent.mouseDown(result.getByText("inside").parentElement);
    assert.equal(clickedOutside, false);
    fireEvent.mouseDown(result.getByText("another"));
    assert.equal(clickedOutside, false);

    fireEvent.mouseDown(result.getByText("outside"));
    assert.equal(clickedOutside, true);

    cleanup();
});

test.run();
