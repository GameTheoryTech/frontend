import React from 'react';
import { Container } from '@mui/material';
import useEagerConnect from '../../hooks/useEagerConnect';
import { makeStyles } from '@mui/styles';

import Footer from '../Footer';
import Nav from '../Nav';
import BackdropImage from '../../assets/img/background.png';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: '5rem',
    '@media (max-width: 767px)': {
      paddingBottom: '7rem',
    }
  }
}));

const Page: React.FC = ({ children }) => {
  useEagerConnect();
  const classes = useStyles();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundImage: 'linear-gradient(135deg, rgba(23,33,55,1) 0%, rgba(22,33,54,1) 60%, rgba(10,16,28,1) 100%)', backgroundColor: `#172137`, overflow: 'hidden' }}>
      <Nav />
      <Container maxWidth="lg" className={classes.container}>
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Page;
