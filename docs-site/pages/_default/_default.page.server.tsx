import fav16 from "/favicon-16x16.png";
import fav32 from "/favicon-32x32.png";
import ReactDOMServer from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr";

import { getPageTitle } from "./getPageTitle";
import { PageWrapper } from "./PageWrapper";
import { PageContext } from "./types";

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ["pageProps", "documentProps", "urlPathname"];

function render(pageContext: PageContext) {
    const { Page, pageProps } = pageContext;
    const pageContent = ReactDOMServer.renderToString(
        <PageWrapper pageContext={pageContext}>
            <Page {...pageProps} />
        </PageWrapper>
    );

    const title = getPageTitle(pageContext);

    return escapeInject`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="📦 A collection of pastable code gathered from past projects" />
                <title>${title}</title>
                <link rel="icon" type="image/png" sizes="32x32" href="${fav32}">
                <link rel="icon" type="image/png" sizes="16x16" href="${fav16}">
            </head>
            <body>
                <div id="page-view">${dangerouslySkipEscape(pageContent)}</div>
            </body>
        </html>`;
}
