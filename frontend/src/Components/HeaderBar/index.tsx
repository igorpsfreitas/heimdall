import {
  Box,
  Flex,
  Text,
  Image,
} from '@chakra-ui/react';

export default function HeaderBar() {

  return (
    <Box as="header" w="100%" h="70px" bgGradient="linear(to-r, blue.500, purple.500)" color="white" position="fixed" top="0" left="0" zIndex="1000">
      <Flex align="center" justify="space-between" w="100%" h="100%" px={4}>
        <Image src="/imgs/logo.png" alt="Heimdall" w="60px" h="65px" ml={3}/>
        <Text textShadow='2px 1px #000' fontSize="xl" fontWeight="bold" textAlign="center" flex="1" ml={4}>Heimdall - Controle de Patrimonio</Text>
        <Box w="60px" mr={3} /> 
      </Flex>
    </Box>
  );
}