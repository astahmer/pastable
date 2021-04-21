import { readdirSync } from "fs";
import path from "path";

import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

const getDirectories = (source: string) =>
    readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

const rootPath = path.join(__dirname, "../");
const packages = getDirectories(path.join(rootPath, "packages"));

// https://vitejs.dev/config/
export default defineConfig({
    // server: { port: 3030 },
    resolve: {
        alias: Object.fromEntries(
            packages.map((name) => ["@pastable/" + name, path.resolve(__dirname, `../packages/${name}/src/index.ts`)])
        ),
    },
    plugins: [reactRefresh()],
});
