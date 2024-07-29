
import {
    Box,
    Flex,
    Text,
  } from '@chakra-ui/react';
import { logout } from '../../Pages/Login/components/fuctions';

const handleLogout = () => {
    logout();
};

export default function HeaderBar() {

  return (
    <Box as="header" w="100%" h="50px" bgGradient="linear(to-r, blue.500, purple.500)" color="white" position="fixed" top="0" left="0" zIndex="1000">
      <Flex align="center" justify="center" w="100%" h="100%">
        
          <Text textShadow='2px 1px #000' fontSize="xl" fontWeight="bold" textAlign="center" onClick={handleLogout}>Heimdall - Controle de Patrimonio</Text>
        
      </Flex>
    </Box>  
  );
};
