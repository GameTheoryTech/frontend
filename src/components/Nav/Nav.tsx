import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import styled from "styled-components";


import ListItemLink from '../ListItemLink';

import { Menu as MenuIcon } from '@mui/icons-material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { makeStyles, useTheme } from '@mui/styles';
import AccountButton from './AccountButton';


const useStyles = makeStyles((theme : any) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: 'var(--white)',
    'background-color': '#ff494922',
    'backdrop-filter': "blur(2px)",
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '0 10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: '"Gilroy"',
    fontSize: '30px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: 'var(--white)',
    fontSize: '14px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: 'var(--white)',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const theme = useTheme() as any;
  const classes = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">2omb Finance</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                Game Theory
              </Link>
            </Typography>
            <Box mr={5}>
              <Link color="color" to="/" className={classes.link}>
                Home
              </Link>
              <Link color="textPrimary" to="/farms" className={classes.link}>
                Farms
              </Link>
              <Link color="textPrimary" to="/theoretics" className={classes.link}>
                Theoretics
              </Link>
              <Link color="textPrimary" to="/nfts" className={classes.link}>
                NFTs
              </Link>
              <Link color="textPrimary" to="/bonds" className={classes.link}>
                Bonds
              </Link>
              <a href="https://ftmscan.com/address/0x90dED1c9c35f06b7239429939832f7Ab896D0E06" target="_blank" className={classes.link}>
                Treasury Wallet
              </a>
              <a href="https://ftmscan.com/address/0x29a92c81795d589b32e98fd119568e738ae5952b" target="_blank" className={classes.link}>
                Developer Wallet
              </a>
              {/* <Link color="textPrimary" to="/treasury" className={classes.link}>
                Treasury
              </Link>
              <a href="/" target="_blank" className={classes.link}>
                Vaults
              </a> */}
              {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link>
              <Link color="textPrimary" to="/liquidity" className={classes.link}>
                Liquidity
              </Link>
              <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link> */}
              {/*<a href="https://beluga.fi" target="_blank" className={classes.link}>*/}
              {/*  Vaults*/}
              {/*</a>*/}
              {/*<a href="https://snapshot.org/#/forgiving.forg.eth" target="_blank" className={classes.link}>*/}
              {/*  Governance*/}
              {/*</a>*/}
              <a href="https://docs.gametheory.tech" target="_blank" className={classes.link}>
                Docs
              </a>
              <Link color="textPrimary" to="/faq" className={classes.link}>
                FAQ
              </Link>
              {/*<a href="https://2omb.finance" target="_blank" className={classes.link}>*/}
              {/*  2omb*/}
              {/*</a>*/}
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Game Theory
            </Typography>

            <Drawer
              className={classes.drawer}
              onClose={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farms" to="/farms" />
                <ListItemLink primary="Theoretics" to="/theoretics" />
                <ListItemLink primary="NFTs" to="/nfts" />
                <ListItemLink primary="Bonds" to="/bonds" />
                {/*<ListItemLink primary="Treasury" to="/treasury" />*/}
                {/* <ListItemLink primary="Masonry" to="/masonry" />
                <ListItemLink primary="Pit" to="/pit" />
                <ListItemLink primary="SBS" to="/sbs" />
                <ListItemLink primary="Liquidity" to="/liquidity" />
                <ListItemLink primary="Regulations" to="/regulations" /> */}
                <ListItem button component="a" href="https://ftmscan.com/address/0x90dED1c9c35f06b7239429939832f7Ab896D0E06">
                  <ListItemText>Treasury Wallet</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://ftmscan.com/address/0x29a92c81795d589b32e98fd119568e738ae5952b">
                  <ListItemText>Developer Fund</ListItemText>
                </ListItem>
                {/*<ListItem button component="a" href="https://snapshot.org/#/forgiving.forg.eth">*/}
                {/*  <ListItemText>Governance</ListItemText>*/}
                {/*</ListItem>*/}
                <ListItem button component="a" href="https://docs.gametheory.tech">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
                <ListItemLink primary="FAQ" to="/faq" />
                {/*<ListItem button component="a" href="https://2omb.finance">*/}
                {/*  <ListItemText>2omb</ListItemText>*/}
                {/*</ListItem>*/}
                <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountButton text="Connect" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
