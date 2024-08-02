// frontend/src/Components/PageWrapper/index.tsx
import { Box, Flex } from "@chakra-ui/react";
import React, { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { getTokenFromLocalStorage, removeAllFromLocalStorage } from "../../hooks/authUtils";
import HeaderBar from "../HeaderBar";
import SideBar from "../SideBar";

export const PageWrapper = () => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const isLoggedIn = !!getTokenFromLocalStorage();
    if (!isLoggedIn) {
      navigate("login", { replace: true });
      removeAllFromLocalStorage();
    }
  }, [navigate]);


  return (
    <Flex direction="row" maxW="100vw">
        <SideBar />
        <HeaderBar />
      <Flex
        direction="column"
        flex={5}
        h="auto"
        maxH="100vh"
        overflowX="hidden"
      >
        <Box mt="65px" ml="200px" padding="8px 32px" overflowY="auto" bottom={0}>
          <Outlet  />
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageWrapper;
