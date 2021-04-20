import { useCallback, useState } from "react";

export const useForceUpdate = () => {
    const [_, setState] = useState({});
    return useCallback(() => setState({}), []);
};
