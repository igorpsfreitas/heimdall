import React from 'react';
import {
    Box,
    Flex,
    Image,
    Button } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { Outlet, Link } from 'react-router-dom';

const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    window.location.reload();
};

export default function TopBar() {

  return (
    <Box as="header" w="100%" h="50px" bg="blue.500" color="white" position="fixed" top="0" left="0" zIndex="1000">
      <Image src="imgs/logo.png" alt="Logo" h="50px" onClick={handleLogout} />
    </Box>  
  );
};
