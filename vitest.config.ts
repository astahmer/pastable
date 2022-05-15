/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        include: ["src/**/tests/*.ts"],
        includeSource: ["src/**/machines/*.ts"],
    },
});
