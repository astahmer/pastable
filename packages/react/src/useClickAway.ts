import { MouseEvent, MutableRefObject, useEffect, useRef } from "react";

import { off, on } from "@pastable/utils";

const defaultEvents: Array<keyof HTMLElementEventMap> = ["mousedown", "touchstart"];

/**
 * Detect and invoke a callback when clicking away of target element.
 * @see Adapted from https://github.com/streamich/react-use
 */
export const useClickAway = (
    ref: MutableRefObject<any>,
    onClickAway: (event: MouseEvent) => void,
    events: Array<keyof HTMLElementEventMap> = defaultEvents
) => {
    const savedCallback = useRef(onClickAway);
    useEffect(() => {
        savedCallback.current = onClickAway;
    }, [onClickAway]);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            ref.current && !ref.current.contains(event.target) && savedCallback.current(event);
        };
        for (const eventName of events) {
            on(document, eventName, handler);
        }
        return () => {
            for (const eventName of events) {
                off(document, eventName, handler);
            }
        };
    }, [events, ref]);
};
