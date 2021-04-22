import { useEffect } from "react";

import { useIsMountedRef } from "@pastable/use-is-mounted";

/**
 * React effect hook that invokes only on update.
 * It doesn't invoke on mount
 * @see Adapted from https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-update-effect.ts
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
    const isMountedRef = useIsMountedRef();

    useEffect(() => {
        if (!isMountedRef.current) return;
        effect();
    }, deps);

    return isMountedRef.current;
};
