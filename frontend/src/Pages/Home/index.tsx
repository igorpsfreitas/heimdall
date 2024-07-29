import React, {useEffect} from 'react';
import {
    Box,
    Text
 } from '@chakra-ui/react';
 import { Helmet } from 'react-helmet-async';

export default function Home() {
  
  return (
    <>
      <Helmet>
        <title>Heimdall - Home</title>
      </Helmet>
      <Box>
        <Text>Home</Text>
      </Box>
    </>
  );
}