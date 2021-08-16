import { PageContext } from "./types";

export { getPageTitle };

function getPageTitle(pageContext: PageContext): string {
    const title =
        // For static titles (defined in the `export { documentProps }` of the page's `.page.js`)
        pageContext.pageExports.documentProps?.title ||
        // For dynamic tiles (defined in the `export addContextProps()` of the page's `.page.server.js`)
        pageContext.documentProps?.title ||
        "pastable";
    return title;
}
