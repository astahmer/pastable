import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { BsGearFill } from "react-icons/bs";
import { FaAtom, FaGithub } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { SiTypescript } from "react-icons/si";

import { AppLink } from "./AppLink";
import { NavItem, TreeItem } from "./NavItem";

export const SidebarContent = (props) => {
    return (
        <Box
            as="nav"
            pb="10"
            bg={useColorModeValue("white", "gray.800")}
            borderColor={useColorModeValue("inherit", "gray.700")}
            borderRightWidth="1px"
            w="60"
            {...props}
        >
            <Flex px="4" py="5" align="center">
                <AppLink
                    href="/"
                    fontSize="2xl"
                    ml="2"
                    color={useColorModeValue("brand.500", "white")}
                    fontWeight="semibold"
                >
                    📦 pastable
                </AppLink>
            </Flex>
            <Flex direction="column" as="nav" fontSize="sm" color="gray.600" aria-label="Main Navigation">
                <NavItem href="/" icon={MdHome}>
                    Home
                </NavItem>
                <NavItem href="https://github.com/astahmer/pastable" target="_blank" icon={FaGithub}>
                    Github
                </NavItem>
                <TreeItem href="/utils" label="utils" icon={BsGearFill} isAnchor defaultIsOpen>
                    <NavItem href="array" />
                    <NavItem href="asserts" />
                    <NavItem href="getters" />
                    <NavItem href="misc" />
                    <NavItem href="object" />
                    <NavItem href="pick" />
                    <NavItem href="primitives" />
                    <NavItem href="random" />
                    <NavItem href="set" />
                </TreeItem>
                <TreeItem href="/react" label="react" icon={FaAtom} defaultIsOpen>
                    <NavItem href="atomWithToggle" />
                    <NavItem href="useClickAway" />
                    <NavItem href="useEvent" />
                    <NavItem href="useForceUpdate" />
                    <NavItem href="useIsMounted" />
                    <NavItem href="useQueryParams" />
                    <NavItem href="useSelection" />
                    <NavItem href="useUpdateEffect" />
                    <NavItem href="usePreloadImages" />
                </TreeItem>
                <NavItem href="/typings" icon={SiTypescript}>
                    typings
                </NavItem>
                {/* <NavItem href="/changelog" icon={FaScroll}>
                    Changelog
                </NavItem> */}
            </Flex>
        </Box>
    );
};
