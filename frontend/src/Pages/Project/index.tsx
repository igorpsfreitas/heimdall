import React, {useEffect} from 'react';
import {
    Box,
    Text
 } from '@chakra-ui/react';
 import { Helmet } from 'react-helmet-async';
import { TypeProject, setProject} from '../../API/projectServices';

export default function Project() {
  
  return (
    <>
      <Helmet>
        <title>Heimdall - Projetos</title>
      </Helmet>
      <Box>
        <Text>Projetoffs</Text>
      </Box>
      </>
  );
}