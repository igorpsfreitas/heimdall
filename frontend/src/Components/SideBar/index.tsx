import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, Link } from 'react-router-dom';

export default function LeftBar() {
  return (
      <Flex mt="50px" flex="1">
        <Box as="aside" w="200px" bg="gray.700" color="white" position="fixed" top="50px" left="0" h="calc(100vh - 50px)" zIndex="1000">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Produtos</Link></li>
            </ul>
          </nav>
        </Box>
        <Box as="main" ml="200px" p="4" flex="1" overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
  );
};
