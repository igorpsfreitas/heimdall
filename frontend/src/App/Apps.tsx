import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../context/AuthContext';
import PageWrapper from '../Components/PageWrapper';
import History from '../Pages/History';
import Project from '../Pages/Project';
import Holder from '../Pages/Holder';
import Login from '../Pages/Login';
import ProtectedRoute from '../Components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import Patrimony from '../Pages/Patrimony';

function App() {
  return (
    <ChakraProvider>
        <AuthProvider>
          <HelmetProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PageWrapper />
                  </ProtectedRoute>
                }>
                <Route path="/" element={<Navigate to="history" />} />
                <Route path='history'index element={<History />} />
                <Route path="projects" element={<Project />} />
                <Route path="holders" element={<Holder />} />
                <Route path='patrimony' element={<Patrimony />} />
              </Route>
              <Route path="*" element={<Navigate to="history" />} />
            </Routes>
          </HelmetProvider>
        </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
