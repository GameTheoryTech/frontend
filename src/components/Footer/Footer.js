import React from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Grid, Typography, Link } from '@mui/material';
import TwitterImage from '../../assets/img/twitter.svg';
import GithubImage from '../../assets/img/github.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import DiscordImage from '../../assets/img/discord.svg';
import YoutubeImage from '../../assets/img/youtube.svg';
import MediumImage from '../../assets/img/medium.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'var(--white)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
    filter: 'sepia(1) brightness(2) hue-rotate(314deg) saturate(7.5)'
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
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="textPrimary" align="left">
              {'Copyright © Game Theory '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <a
              href="https://twitter.com/GameTheoryTech"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="twitter" src={TwitterImage} className={classes.img} />
            </a>
            <a
              href="https://github.com/GameTheoryTech"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="github" src={GithubImage} className={classes.img} />
            </a>
            {/*<a href="https://t.me/community2ombchat" rel="noopener noreferrer" target="_blank" className={classes.link}>*/}
            {/*  <img alt="telegram" src={TelegramImage} className={classes.img} />*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  href="https://www.youtube.com/results?search_query=2omb+finance"*/}
            {/*  rel="noopener noreferrer"*/}
            {/*  target="_blank"*/}
            {/*  className={classes.link}*/}
            {/*>*/}
            {/*  <img alt="youtube" src={YoutubeImage} className={classes.img} />*/}
            {/*</a>*/}
            <a href="https://discord.gg/DVc27ub3D8" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="discord" src={DiscordImage} className={classes.img} />
            </a>
            <a href="https://gametheorytech.medium.com" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="medium" src={MediumImage} className={classes.img} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
