import ReactDOMServer from "react-dom/server";
import { html } from "vite-plugin-ssr";

import { getPageTitle } from "./getPageTitle";
import logoUrl from "./logo.png";
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

    return html`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="📦 A collection of pastable code gathered from past projects" />
                <title>${title}</title>
                <link rel="icon" href="${logoUrl}" />
            </head>
            <body>
                <div id="page-view">${html.dangerouslySkipEscape(pageContent)}</div>
            </body>
        </html>`;
}
