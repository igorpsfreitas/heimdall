import { login } from './components/fuctions';
import { useState } from 'react';// Import the useState hook
import {
  Button,
  Box,
  Card,
  CardBody,
  CardFooter,
  Spacer,
  FormControl,
  FormLabel,
  Input,
  Image,
} from '@chakra-ui/react';
import HeaderBar from '../../Components/HeaderBar';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  
  const handleLogin = () => {
    login(username, password);
  };

  return (
    <>
      <Helmet>
        <title>Heimdall - Login</title>
      </Helmet>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgGradient="linear(to-r, teal.500, blue.500)">
        <HeaderBar />
        <Card boxShadow="dark-lg">
          <CardBody>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Image src="imgs/logo.png" alt="Logo" h="50px" />
            </Box>
            <FormControl id="login" isRequired>
              <FormLabel>Login:</FormLabel>
              <Input id="username" type="text" placeholder='Digite o nome de usuário...' value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('password')?.focus();
                }
              }} autoFocus={true} autoComplete="off" />
              <FormLabel>Senha:</FormLabel>
              <Input id="password" type="password" placeholder='Digite a senha...' value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }} />
            </FormControl>
          </CardBody>
          <CardFooter display="flex" justifyContent="flex-end">
            <Button onClick={handleLogin} colorScheme="yellow">Consultar</Button>
            <Spacer />
            <Button onClick={handleLogin} colorScheme="teal">Login</Button>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
};
