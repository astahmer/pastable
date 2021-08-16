import reactRefresh from "@vitejs/plugin-react-refresh";
import remarkSlug from "remark-slug";
import { UserConfig } from "vite";
import mdx from "vite-plugin-mdx";
import { VitePWA } from "vite-plugin-pwa";
import ssr from "vite-plugin-ssr/plugin";
import reactJsx from "vite-react-jsx";

const config: UserConfig = {
    plugins: [reactRefresh(), reactJsx(), VitePWA(), mdx({ remarkPlugins: [remarkSlug] }), ssr()],
    optimizeDeps: { include: ["@mdx-js/react"] },
    resolve: { alias: [{ find: "@", replacement: "/src" }] },
};

export default config;
