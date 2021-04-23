import { useEffect, useRef } from "react";

import { useIsMountedRef } from "@pastable/use-is-mounted";
import { on } from "@pastable/utils";

/** Define an event listener on window or a given element declaratively */
export function useEvent<Data = unknown, Event extends keyof HTMLElementEventMap = any>(
    event: Event,
    callback: (data: Data) => void,
    element: HTMLElement | Window = window
) {
    const callbackRef = useRef<typeof callback>();
    const offRef = useRef<Function>();

    const isMountedRef = useIsMountedRef();
    const safeCallbackRef = useRef(function () {
        if (!isMountedRef.current) return;
        callbackRef.current.apply(null, arguments);
    });

    useEffect(() => {
        const isEqual = callback === callbackRef.current;
        if (!isEqual) {
            offRef.current?.();
            callbackRef.current = callback;

            if (callbackRef.current) {
                offRef.current = on(element, event as any, safeCallbackRef.current);
            }
        }

        return () => offRef.current?.();
    }, [callback, element]);
}
