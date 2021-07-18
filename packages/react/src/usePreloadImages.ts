import { useEffect } from "react";

export const usePreloadImages = (initialImages: string[] = []) => {
    const preloadImages = (images: string[]) => {
        images.forEach((image) => {
            const img = new Image();
            img.src = image;
        });
    };

    useEffect(() => {
        preloadImages(initialImages);
    }, []);

    return preloadImages;
};
