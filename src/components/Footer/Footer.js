import React from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Grid, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '../../assets/img/medium-logo.svg';
import DiscordIcon from '../../assets/img/discord-logo.svg';


const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'var(--accent)',
    backgroundColor: 'rgba(255,255,255,.05)',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
    '& .right': {
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        marginTop: '15px',
      },
    }
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
    color: 'var(--accent)',
    '&:first-child': {
      marginLeft: '0',
    }
  },

  img: {
    width: '24px',
    height: '24px',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container style={{alignItems: 'center'}}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textPrimary" style={{color: 'var(--accent-color)', fontWeight: '700'}}>
              {'© '}
              {new Date().getFullYear()}
              {` Game Theory`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="right">
            <a
              href="https://twitter.com/GameTheoryTech"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <TwitterIcon color="var(--accent)" style={{fontSize: '24px'}} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCsttAlG8MNA6Fi01QYxhmIg"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <YouTubeIcon color="var(--accent)" style={{fontSize: '24px'}} />
            </a>
            <a href="https://discord.gg/DVc27ub3D8" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="discord" src={DiscordIcon} className={classes.img} />
            </a>
            <a href="https://gametheorytech.medium.com" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="Medium" src={MediumIcon} className={classes.img} />
            </a>
            <a
              href="https://github.com/GameTheoryTech"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <GitHubIcon color="var(--accent)"style={{fontSize: '24px'}} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
