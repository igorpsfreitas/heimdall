import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../Components/Layout';
import Home from '../Pages/Home';
import Project from '../Pages/Project';
import Login from '../Pages/Login';
import ProtectedRoute from '../Components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider>
      
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="projects" element={<Project />} />
            </Route>
          </Routes>
        </AuthProvider>
      
    </ChakraProvider>
  );
}

export default App;
