import React, { useMemo } from 'react';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import {
  AppBar,
  Box,
  Grid,
  Drawer,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Container,
  Button
} from '@mui/material';

import ListItemLink from '../ListItemLink';

//import { Menu as MenuIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '../../assets/img/menu-icon.svg';
import { ExpandMore as ChevronDownIcon } from '@mui/icons-material';
import { makeStyles, useTheme } from '@mui/styles';
import AccountButton from './AccountButton';
import useTombStats from '../../hooks/useTombStats';
import usetShareStats from '../../hooks/usetShareStats';
import useBondStats from '../../hooks/useBondStats';

import BackgroundImage from '../../assets/img/bg.jpg'

const useStyles = makeStyles((theme : any) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      '& a': {
        '&:hover': {
          textDecoration: 'none',
          color: 'var(--extra-color-1)',
          textShadow: '0px 0px 20px var(--extra-color-1)'
        },
        '&.active:not(.about)': {
          textDecoration: 'none',
          color: 'var(--extra-color-1)',
          textShadow: '0px 0px 20px var(--extra-color-1)'
        }
      }
    }
  },
  appBar: {
    fontFamily: '"kallisto", sans-serif',
    color: '#fff',
    'background-color': 'transparent',
    position: 'relative',
    zIndex: '10'
  },
  secondBar: {
    borderTop: '1px solid rgba(255,255,255,.1)',
    paddingTop: '15px'
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    fontFamily: '"kallisto", sans-serif',
  },
  drawerPaper: {
    width: 240,
    backgroundColor: '#0A142A',
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  link: {
    color: '#fff',
    margin: '0 15px',
    fontWeight: '700',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: 'var(--extra-color-1)',
      textShadow: '0px 0px 20px var(--extra-color-1)'
    },
    '&.active:not(.about)': {
      textDecoration: 'none',
      color: 'var(--extra-color-1)',
      textShadow: '0px 0px 20px var(--extra-color-1)'
    }
  },
  brandLink: {
    textTransform: 'uppercase',
    fontFamily: '"kallisto", sans-serif',
    fontWeight: '500',
    textDecoration: 'none',
    color: 'var(--white)',
    textShadow: '0px 0px 10px #fff',
    overflow: 'initial',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: theme.spacing(2),
    paddingTop: theme.spacing(2),
    zIndex: 10,
  },
  dropdownInner: {
    minWidth: '170px',
    padding: theme.spacing(2),
    backgroundColor: '#0A101C',
    color: '#fff'
  },
  dropdownButton: {
    display: 'inline',
    position: 'relative',
    cursor: 'pointer',
    '&:before': {
      content: '""',
    },
    '&.open': {
      '& $link': {
        textDecoration: 'none',
        color: 'var(--extra-color-1)',
        textShadow: '0px 0px 20px var(--extra-color-1)',
      },
      '& $dropdownContent': {
        display: 'block'
      },
      '& $dropdownChevron': {
        transform: 'rotate(180deg)'
      }
    }
  },
  dropdownLink: {
    display: 'block',
    marginBottom: theme.spacing(2),
    color: '#fff',
    fontWeight: '700',
    textDecoration: 'none',
    '&:last-child': {
      marginBottom: 0
    },
    '&:hover': {
      textDecoration: 'none',
      color: 'var(--extra-color-1)',
      textShadow: '0px 0px 20px var(--extra-color-1)'
    },
    '&.active:not(.about)': {
      textDecoration: 'none',
      color: 'var(--extra-color-1)',
      textShadow: '0px 0px 20px var(--extra-color-1)'
    }
  },
  dropdownChevron: {
    position: 'relative',
    top: '-2px',
    display: 'inline',
    verticalAlign: 'middle'
  },
  button: {
    fontSize: '14px',
    '& span': {
      marginLeft: '10px',
    },
    '@media (max-width: 767px)': {
      '& span': {
        display: 'none',
      },
      padding: '10px 0',
    }
  }

}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:767px)');
  const theme = useTheme() as any;
  const classes = useStyles(theme);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // create dropdown hover effect
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  return (
    <>
    {location.pathname !== '/' && (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Container maxWidth="lg">
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h5" color="inherit" noWrap>
              {/* <a className={ classes.brandLink } href="/">2omb Finance</a> */}
              <NavLink to="/" color="inherit" className={classes.brandLink}>
                Game Theory
              </NavLink>
            </Typography>
            <Box>
              <NavLink exact activeClassName="active" color="color" to="/home" className={classes.link}>
                Home
              </NavLink>
              <NavLink activeClassName="active" color="textPrimary" to="/altergene" className={classes.link}>
                Altergene
              </NavLink>
              <NavLink activeClassName="active" color="textPrimary" to="/farms" className={classes.link}>
                Staking Pools
              </NavLink>
              <NavLink activeClassName="active" color="textPrimary" to="/nfts" className={classes.link}>
                NFTs
              </NavLink>
              <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{display: "inline"}} className={`${classes.dropdownButton} ${isOpen ? 'open' : ''}`}>
                <a className={classes.link}>
                  More
                  <ChevronDownIcon className={classes.dropdownChevron} />
                </a>
                <div className={`${classes.dropdownContent}`}>
                  <div className={classes.dropdownInner}>
                    <a href="https://docs.gametheory.tech" target="_blank" className={classes.dropdownLink}>
                      Documentation
                    </a>
                    <a href="https://dexscreener.com/fantom/0x168e509FE5aae456cDcAC39bEb6Fd56B6cb8912e" target="_blank" className={classes.dropdownLink}>
                      GAME Chart
                    </a>
                    <a href="https://dexscreener.com/fantom/0xF69FCB51A13D4Ca8A58d5a8D964e7ae5d9Ca8594" target="_blank" className={classes.dropdownLink}>
                      THEORY Chart
                    </a>
                    <NavLink color="textPrimary" to="/about" className={classes.dropdownLink}>
                      About Game Theory
                    </NavLink>
                    <NavLink exact color="textPrimary" to="/about#community" className={`about ${classes.dropdownLink}`}>
                      Community
                    </NavLink>
                    <NavLink exact color="textPrimary" to="/about#walletAddresses" className={`about ${classes.dropdownLink}`}>
                      Wallet Addresses
                    </NavLink>
                  </div>
                </div>
              </div>
              
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={handleDrawerOpen}
              className={`${clsx(open)}` + ' ' + classes.button}
              style={{height: '44px'}}
            >
              <img src={MenuIcon} style={{height: '18px'}} />
            </Button>

            <Typography variant="h5" color="inherit" noWrap>
              <NavLink to="/" color="inherit" className={classes.brandLink}>
                Game Theory
              </NavLink>
            </Typography>

            <AccountButton text="Connect" />

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
              <div style={{paddingLeft: '10px',paddingRight: '10px', paddingTop: '10px'}}>
                <CloseIcon onClick={handleDrawerClose} className="textGlow pink" style={{cursor: 'pointer', fontSize: '35px'}} />
              </div>
              <List>
                <ListItemLink primary="Home" to="/home" />
                <ListItemLink primary="Altergene" to="/altergene" />
                <ListItemLink primary="Staking Pools" to="/farms" />
                <ListItemLink primary="NFTs" to="/nfts" />
                <ListItem button component="a" href="https://docs.gametheory.tech">
                  <ListItemText>Documentation</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://dexscreener.com/fantom/0x168e509FE5aae456cDcAC39bEb6Fd56B6cb8912e">
                  <ListItemText>GAME Chart</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://dexscreener.com/fantom/0xF69FCB51A13D4Ca8A58d5a8D964e7ae5d9Ca8594">
                  <ListItemText>THEORY Chart</ListItemText>
                </ListItem>
                <ListItemLink primary="About Game Theory" to="/about" />
                <ListItemLink primary="Community" to="/about#community" classname="about" />
                <ListItemLink primary="Wallet Addresses" to="/about#walletAddresses" classname="about" />
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
      {location.pathname !== '/home' && (
      <Toolbar className={classes.secondBar} style={{minHeight: '0', textAlign: 'center'}}>
        <Grid container columnSpacing={4} justifyContent="center">
          
          <Grid item xs={'auto'}>
            <a href="https://spooky.fi/swap?outputCurrency=0x56EbFC2F3873853d799C155AF9bE9Cb8506b7817" target="_blank" style={{textDecoration: 'none', fontWeight: '700'}}>
              <span className="textGlow">GAME</span>
              <Typography variant="body1" color="var(--white)">
                ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
              </Typography>
            </a>
          </Grid>

          <Grid item xs={'auto'}>
            <a href="https://spooky.fi/swap?outputCurrency=0x60787C689ddc6edfc84FCC9E7d6BD21990793f06" target="_blank" style={{textDecoration: 'none', fontWeight: '700'}}>
              <span className="textGlow">THEORY</span>
              <Typography variant="body1" color="var(--white)">
                ${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}
              </Typography>
            </a>
          </Grid>

          <Grid item xs={'auto'}>
            <NavLink to="/bonds" style={{textDecoration: 'none', fontWeight: '700'}}>
              <span className="textGlow">HODL</span>
              <Typography variant="body1" color="var(--white)">
                ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
              </Typography>
            </NavLink>
          </Grid>

        </Grid>
      </Toolbar>
      )}
      </Container>
    </AppBar>
    )}
    <div className="image-bg" style={{backgroundImage: "url("+BackgroundImage+")"}} ></div>
    </>
  );
};

export default Nav;
