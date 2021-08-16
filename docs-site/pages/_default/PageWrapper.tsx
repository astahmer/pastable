import "./PageWrapper.css";
import "./splendid.scss";

import { Layout } from "@/../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

import { PageContext } from "./types";
import { PageContextProvider } from "./usePageContext";

export { PageWrapper };

type Children = React.ReactNode;

function PageWrapper({ pageContext, children }: { pageContext: PageContext; children: Children }) {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <ChakraProvider>
                    <Layout>{children}</Layout>
                </ChakraProvider>
            </PageContextProvider>
        </React.StrictMode>
    );
}
