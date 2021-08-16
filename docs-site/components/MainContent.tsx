import { Box, Flex, IconButton, Input, InputGroup, InputLeftElement, useColorModeValue } from "@chakra-ui/react";
import { FiMenu, FiSearch } from "react-icons/fi";

export const MainContent = ({ children, sidebar }) => {
    return (
        <Flex
            id="page-content"
            direction="column"
            w="100%"
            h="100vh"
            mr={{ base: 0, sm: 0, md: 0, lg: 20, xl: 40 }}
            transition=".3s ease"
        >
            {false && (
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    w="full"
                    px="4"
                    py="8"
                    bg={useColorModeValue("white", "gray.800")}
                    borderBottomWidth="1px"
                    borderColor={useColorModeValue("inherit", "gray.700")}
                    h="14"
                >
                    <IconButton
                        aria-label="Menu"
                        display={{ base: "inline-flex", md: "none" }}
                        onClick={sidebar.onOpen}
                        icon={<FiMenu />}
                        size="sm"
                    />
                    <InputGroup w="96" display={{ base: "none", md: "flex" }}>
                        <InputLeftElement color="gray.500" children={<FiSearch />} />
                        {/* TODO autocomplete ? */}
                        {/* https://github.com/anubra266/choc-ui/blob/main/components/doc-search/handleSearch.ts */}
                        <Input placeholder="Search for methods..." />
                    </InputGroup>
                </Flex>
            )}

            <Box as="main" p="4" h="10%" minH="0" flex="auto">
                <Box borderWidth="4px" borderStyle="dashed" rounded="md" className="splendid" h="100%" overflow="auto">
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};
