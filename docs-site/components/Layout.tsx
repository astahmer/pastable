import { Drawer, DrawerContent, DrawerOverlay, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";

import { MainContent } from "./MainContent";
import { SidebarContent } from "./SidebarContent";

export function Layout({ children }) {
    const sidebar = useDisclosure();

    return (
        <Flex
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            minW="100vw"
            minH="100vh"
            overflowX="hidden"
            overflowY="auto"
            justifyContent="center"
        >
            <Flex as="section" minW={["100%"]} bg={useColorModeValue("gray.50", "gray.700")}>
                <SidebarContent
                    pl={{ base: 0, sm: 0, md: 0, lg: 0, xl: 40 }}
                    minW={{ md: "200px", lg: "250px", xl: "400px" }}
                    display={{ base: "none", md: "unset" }}
                />
                <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement="left">
                    <DrawerOverlay />
                    <DrawerContent>
                        <SidebarContent w="full" borderRight="none" />
                    </DrawerContent>
                </Drawer>
                <MainContent sidebar={sidebar}>{children}</MainContent>
            </Flex>
        </Flex>
    );
}
