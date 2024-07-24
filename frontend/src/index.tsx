import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Apps from './App/Apps';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement);
root.render(
 
  <ChakraProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Apps />
      </React.StrictMode>
    </BrowserRouter>
  </ChakraProvider>
);