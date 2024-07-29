import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Box } from '@chakra-ui/react';


export default function Login() {
  const { login } = useAuth() as { login: () => void };
  
  const handleLogin = () => {
    login();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Button onClick={handleLogin} colorScheme="teal">Login</Button>
    </Box>
  );
};
