// src/components/layout/Layout.tsx
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1" py={8} px={4}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;