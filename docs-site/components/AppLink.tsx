import { LinkProps, chakra } from "@chakra-ui/react";

import { usePageContext } from "../pages/_default/usePageContext";

export function AppLink(props: LinkProps) {
    const pageContext = usePageContext();
    const className = ["navigation-link", pageContext.urlPathname === props.href && "is-active"]
        .filter(Boolean)
        .join(" ");

    return <chakra.a className={className} {...props} />;
}
