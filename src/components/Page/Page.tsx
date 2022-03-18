import React from 'react';
import { Container } from '@mui/material';
import useEagerConnect from '../../hooks/useEagerConnect';

import Footer from '../Footer';
import Nav from '../Nav';
import BackdropImage from '../../assets/img/background.png';
const Page: React.FC = ({ children }) => {
  useEagerConnect();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: `#260d0d`, backgroundImage: `url(${BackdropImage})` }}>
      <Nav />
      <Container maxWidth="lg" style={{ paddingBottom: '5rem' }}>
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Page;
