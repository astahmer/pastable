import express from "express";
import { createPageRenderer } from "vite-plugin-ssr";

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
    const app = express();

    let viteDevServer;
    if (isProduction) {
        app.use(express.static(`${root}/dist/client`, { index: false }));
    } else {
        const vite = require("vite");
        viteDevServer = await vite.createServer({
            root,
            server: { middlewareMode: true },
        });
        app.use(viteDevServer.middlewares);
    }

    const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
    app.get("*", async (req, res, next) => {
        const url = req.originalUrl;
        const pageContext = { url };
        const result = await renderPage(pageContext);
        if (!result.httpResponse) return next();
        res.status(result.httpResponse.statusCode).send(result.httpResponse.body);
    });

    const port = process.env.PORT || 3010;
    app.listen(port);
    console.log(`Server running at http://localhost:${port}`);
}
