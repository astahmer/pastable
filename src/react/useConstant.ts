import * as React from "react";

interface ResultBox<T> {
    v: T;
}

/**
 * @see https://github.com/Andarist/use-constant
 * @see https://github.dev/statelyai/xstate/blob/fb2cad2d9656c5dc4469f71cc4bd8e3a12bb2424/packages/xstate-react/src/useConstant.ts#L7
 */
export function useConstant<T>(fn: () => T): T {
    const ref = React.useRef<ResultBox<T>>();

    if (!ref.current) {
        ref.current = { v: fn() };
    }

    return ref.current.v;
}
