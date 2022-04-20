import * as React from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';

import { Paper, Box, Button, Grid, Typography } from '@mui/material';

import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DiscordIcon from '../../assets/img/discord-logo.svg';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  link: {
    width: '40px',
    height: '40px',
    display: 'inline',
    marginLeft: '20px',
    color: 'var(--accent)',
    '&:first-child': {
      marginLeft: '0',
    }
  },

  img: {
    width: '40px',
    height: '40px',
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <Page>
      <Paper>
        
      <Grid container className="section">
          <Grid item xs={12}>
            <Box style={{textAlign: 'center'}}>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}} align="center">About Game Theory</Typography>
              <Typography variant='body2'>Game Theory is building an ecosystem of exciting blockchain games on the Fantom Opera Blockchain, headlined by our flagship game, "Brutal Network". Founded by our AAA game developer, Sweetie, she wanted to create a platform where cryptocurrency and high-quality gaming could seamlessly merge in a fun and user-friendly way: where investing could be gaming, and gaming could be investing.<br /><br />

              Since its initial launch, the Game Theory team has grown extensively, allowing development and new releases to proceed at a rapid pace.<br /><br />

              Players in our ecosystem operate in our native currency, "GAME", and can become shareholders in our ecosystem through our share token "THEORY" and governance token "MASTER". Let the games begin!</Typography>
              </Box>
          </Grid>
        </Grid>

        <Grid container className="section" style={{paddingTop: '0'}}>
          <Grid item xs={12}>
            <Box style={{textAlign: 'center'}}>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}} align="center">About Brutal Network</Typography>
              <Typography variant='body2'>Brutal Network is an online shooter role-playing game. Your character will start as a new recruit who is called to help defend the city from the invading monsters! Heroes and spirits will aid you in your defence of the city, and as your character wins battles on your journey throughout the world, you will have the ability to level up your skills, collect gear and items, and become the ultimate warrior!</Typography>
              </Box>
          </Grid>
        </Grid>

        <Grid id="documentation" container className="section" style={{paddingTop: '0'}}>
          <Grid item xs={12}>
            <Box style={{textAlign: 'center'}}>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}}>Game Theory Documentation</Typography>
              <Typography variant='body2'>All the documentation for the Game Theory protocol and Brutal Network Game can be <a href="https://docs.gametheory.tech/" target="_blank" style={{color:'var(--accent)'}}>viewed here</a>.</Typography>
              </Box>
          </Grid>
        </Grid>

        <Grid id="community" container className="section" style={{paddingTop: '0'}}>
          <Grid item xs={12}>
            <Box style={{textAlign: 'center'}}>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}}>Join Our Community</Typography>
              <Typography variant='body2'>Our development and marketing team are actively engaged with our Game Theory community. You can join our discord if you’d like to connect with us, ask us a question or provide feedback. You can also check out our Twitter and YouTube channel for regular updates.</Typography>

                <Box style={{textAlign: 'center', marginTop: '20px'}}>
                  <a
                    href="https://twitter.com/GameTheoryTech"
                    rel="noopener noreferrer"
                    target="_blank"
                    className={classes.link}
                  >
                    <TwitterIcon color="var(--accent)" style={{fontSize: '40px'}} />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCsttAlG8MNA6Fi01QYxhmIg"
                    rel="noopener noreferrer"
                    target="_blank"
                    className={classes.link}
                  >
                    <YouTubeIcon color="var(--accent)" style={{fontSize: '40px'}} />
                  </a>
                  <a href="https://discord.gg/DVc27ub3D8" rel="noopener noreferrer" target="_blank" className={classes.link}>
                    <img alt="discord" src={DiscordIcon} className={classes.img} />
                  </a>
                </Box>
              </Box>
          </Grid>
        </Grid>

        <Grid id="walletAddresses" container className="section" style={{paddingTop: '0'}}>
          <Grid item xs={12}>
            <Box style={{textAlign: 'center'}}>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}}>Wallet Addresses</Typography>
              <Typography variant='body2'>We believe in transparency. All protocol wallets can be viewed below.</Typography>
              </Box>
              <Box style={{textAlign: 'center', marginTop: '40px'}}>
                <Button style={{marginRight: '20px', marginBottom: '20px'}} variant="contained" href="https://ftmscan.com/address/0x90dED1c9c35f06b7239429939832f7Ab896D0E06" target="_blank" rel="noopener noreferrer">Treasury Wallet 1</Button>
                <Button style={{marginRight: '20px', marginBottom: '20px'}} variant="contained" href="https://ftmscan.com/address/0x113Ca1D5c26d1a2D5a08fF21B2E7ECD42b7b082B" target="_blank" rel="noopener noreferrer">Treasury Wallet 2</Button>
                <Button style={{marginRight: '20px', marginBottom: '20px'}} variant="contained" href="https://ftmscan.com/address/0x29a92c81795d589b32e98fd119568e738ae5952b" target="_blank" rel="noopener noreferrer">Developer Wallet</Button>
              </Box>
          </Grid>
        </Grid>

      </Paper>
    </Page>
  );
};

export default About;
