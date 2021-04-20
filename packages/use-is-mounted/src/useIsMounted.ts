import { useEffect, useRef, useState } from "react";

export function useIsMountedRef() {
    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
}

export const useIsMounted = () => {
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    return isMounted;
};
