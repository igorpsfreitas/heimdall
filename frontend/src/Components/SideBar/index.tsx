import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import SidebarButton from "./Button/Button";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../../hooks/authUtils";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const isSelected = (path: string) => location.pathname === path;

  return (
    <Flex
      mt="65px"
      p={2}
      position="fixed"
      bgGradient="linear(to-b, blue.500, purple.500)"
      direction="column"
      justify="space-between"
      w="200px"
      h="auto"
      top={0}
      left={0}
      bottom={0}
    >
      <VStack spacing={4} align="start">
        <SidebarButton name="Home" pagePath="/" isSelected={isSelected("/")} />
        <SidebarButton name="Projetos" pagePath="/projects" isSelected={isSelected("/projects")} />
        <SidebarButton name="Bolsistas" pagePath="/holders" isSelected={isSelected("/holders")} />
      </VStack>
      <Box
        w="100%"
        color="white"
        boxShadow="base"
        fontSize="1.2rem"
        textTransform="capitalize"
        fontWeight="normal"
        transition="0.1s background-color"
        userSelect="none"
        cursor="pointer"
        _hover={{
          shadow: "dark-lg",
          rounded: "md",
        }}
        _active={{ backgroundColor: "#656396" }}
        onClick={logout}
        mt="auto"
      >
        <Flex align="center" px={4} py={2}>
          <FiLogOut size="1.5rem" color="white" />
          <Text ml="1rem" color="white" fontWeight="bold">
            Sair
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Sidebar;
