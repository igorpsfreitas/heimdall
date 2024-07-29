import React from 'react';
import {Flex } from '@chakra-ui/react';
import HeaderBar from '../HeaderBar';
import SideBar from '../SideBar';

const Layout = () => {
  return (
    <Flex direction="column" h="100vh">
      <HeaderBar />
      <SideBar />
    </Flex>
  );
};

export default Layout;
