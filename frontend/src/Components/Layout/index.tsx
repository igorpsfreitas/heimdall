import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, Link } from 'react-router-dom';
import TopBar from '../TopBar';
import LeftBar from '../LeftBar';

const Layout = () => {
  return (
    <Flex direction="column" h="100vh">
      <TopBar />
      <LeftBar />
    </Flex>
  );
};

export default Layout;
