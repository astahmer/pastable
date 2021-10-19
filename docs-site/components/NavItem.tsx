import { Box, Collapse, Flex, Icon, Stack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { createContext } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import { AppLink } from "./AppLink";

export const NavItem = (props) => {
    const { icon, children, target, ...rest } = props;
    const { href: namespace, icon: namespaceIcon, isAnchor } = useContext(TreeItemContext);

    return (
        <AppLink href={namespace ? namespace + (isAnchor ? "#" : "/") + props.href : props.href} target={target}>
            <Flex
                align="center"
                px="4"
                pl="4"
                py={namespace ? "1" : "3"}
                cursor="pointer"
                color={useColorModeValue("inherit", "gray.400")}
                _hover={{
                    bg: useColorModeValue("gray.100", "gray.900"),
                    color: useColorModeValue("gray.900", "gray.200"),
                }}
                role="group"
                fontWeight="semibold"
                transition=".15s ease"
                {...rest}
            >
                {(icon || namespaceIcon) && (
                    <Icon
                        mr="2"
                        boxSize="4"
                        _groupHover={{
                            color: useColorModeValue("gray.600", "gray.300"),
                        }}
                        as={icon || namespaceIcon}
                    />
                )}
                {children || props.href}
            </Flex>
        </AppLink>
    );
};

export const TreeItem = ({ children, defaultIsOpen, isAnchor, ...props }: any) => {
    const collapse = useDisclosure({ defaultIsOpen });

    return (
        <>
            <NavItem {...props} onClick={collapse.onToggle}>
                {props.label || props.href}
                <Box display="inline" px="2" ml="auto">
                    <Icon boxSize="4" as={MdKeyboardArrowRight} transform={collapse.isOpen && "rotate(90deg)"} />
                </Box>
            </NavItem>
            <Collapse in={collapse.isOpen}>
                <Flex direction="column" pl={4}>
                    <TreeItemContext.Provider value={{ href: props.href, icon: props.icon, isAnchor }}>
                        {children}
                    </TreeItemContext.Provider>
                </Flex>
            </Collapse>
        </>
    );
};

const TreeItemContext = createContext({ href: undefined, icon: undefined, isAnchor: false });
