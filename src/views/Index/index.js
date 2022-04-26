import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { Typography, Box, Button, Card, CardContent, Grid, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
import { Link } from 'react-router-dom';
import ReactPlayer from "react-player";

import nftIcon from '../../assets/img/1-nft.png';
import arcadeIcon from '../../assets/img/2-arcade.png';
import rpgIcon from '../../assets/img/3-rpg.png';
import wageringIcon from '../../assets/img/4-wagering.png';
import seigniorageIcon from '../../assets/img/5-seigniorage.png';

const useStyles = makeStyles((theme) => ({
    heading: {
        maxWidth: '100%',
        width: '500px',
        margin: '0 auto',
        fontWeight: '500'
    },
}));

const Index = () => {
    const classes = useStyles();
    return (
        <Page>
            {/* Logo & bio */}
            <Grid container justifyContent="center" className="section" spacing={3}>
                <Grid item xs={12} style={{textAlign: 'center'}}>
                    <Typography variant="h2" component="h1" className='textGlow pink' style={{marginBottom: '10px', textTransform: 'uppercase'}}>Game Theory</Typography>
                    <Typography variant="h5" component="p" className={classes.heading}>The Blockchain Gaming Ecosystem Powered by $GAME</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center" className="section" style={{paddingTop: '0'}}>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="boxed">
                        <CardContent align="center">
                                <Box style={{marginBottom: '20px'}}>
                                    <CardIcon>
                                        <img src={nftIcon} alt="" width={64} height={64} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
                                    </CardIcon>
                                </Box>
                                <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>NFT Marketplace</Typography>
                                <Typography variant="body2" component="p" className="textGlow">Buy and sell NFTs</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="boxed">
                        <CardContent align="center">
                                <Box style={{marginBottom: '20px'}}>
                                    <CardIcon>
                                        <img src={arcadeIcon} alt="" width={64} height={64} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
                                    </CardIcon>
                                </Box>
                                <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>Arcade</Typography>
                                <Typography variant="body2" component="p" className="textGlow">Play Classic Arcade Games</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="boxed">
                        <CardContent align="center">
                                <Box style={{marginBottom: '20px'}}>
                                    <CardIcon>
                                        <img src={rpgIcon} alt="" width={64} height={64} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
                                    </CardIcon>
                                </Box>
                                <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>RPG Shooter</Typography>
                                <Typography variant="body2" component="p" className="textGlow">Defend the City from Monsters</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="boxed">
                        <CardContent align="center">
                                <Box style={{marginBottom: '20px'}}>
                                    <CardIcon>
                                        <img src={wageringIcon} alt="" width={64} height={64} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
                                    </CardIcon>
                                </Box>
                                <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>Wagering</Typography>
                                <Typography variant="body2" component="p" className="textGlow">Lottery and Speculation Market</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="boxed">
                        <CardContent align="center">
                                <Box style={{marginBottom: '20px'}}>
                                    <CardIcon>
                                        <img src={seigniorageIcon} alt="" width={64} height={64} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
                                    </CardIcon>
                                </Box>
                                <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>Seigniorage</Typography>
                                <Typography variant="body2" component="p" className="textGlow">Earn Dividends on your Shares</Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Button variant="contained" href="/#/home" fullWidth>
                        Enter Here to Play
                    </Button>
                </Grid>
            </Grid>

                    {/* Explanation text */}
        <Grid container className="section" justifyContent="center" align="center" style={{paddingBottom: '0'}}>
          <Grid item xs={12} sm={8}>
            <Box>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}}>About Game Theory</Typography>
              <Typography variant='body2' style={{marginBottom:'20px'}}>Game Theory is merging decentralized finance and gaming. Our ecosystem will include wagering, arcade, strategy and RPG games. Our games are engaging, challenging and most of all fun! They also give gamers the chance to win money through breaking high scores or completing certain levels, or winning rounds.</Typography>
              <Typography variant='body2' style={{marginBottom:'20px'}}>The seigniorage side of the protocol gives the opportunity to benefit from the growth of the ecosystem. There are three avenues for this: Our liquidity pools, our share token $THEORY and our governance token $MASTER. The more popular our games are and the more our currency $GAME is used, and the more valuable our liquidity pool and our share token incentives become.</Typography>
              <Typography variant='body2' style={{marginBottom:'20px'}}>Our NFTs provide a bridge between the two sides of the ecosystem, as holding an NFT boosts prize money and gives access to certain levels for gamers, while it gives investors the ability to earn higher rewards.</Typography>
              <Typography variant='body2' >Whether you are a gamer, an investor or a little bit of both, Game Theory caters to all and our goal is to be the premier gaming ecosystem in decentralized finance.</Typography>
              </Box>
          </Grid>
        </Grid>

            
        <Grid container className="section" justifyContent="center" align="center">
          <Grid item xs={12} sm={8}>
            <Box>
              <Typography variant="h2" className="textGlow pink" style={{marginBottom:'20px'}}>New to Crypto?</Typography>
              <Typography variant='body2'>If you're just getting started with crypto or DeFi, please watch the video instructions below on how to buy and transfer tokens on an exchange, use the Metamask wallet and buy DAI tokens on the Fantom Opera blockchain.</Typography>
            </Box>
            <div className="wistia_responsive_padding" style={{padding:'56.25% 0 0 0', boxShadow: '0px 0px 10px 0px var(--extra-color-1)', position:'relative', marginTop: '50px', borderRadius: '20px'}}>
              <div className="wistia_responsive_wrapper" style={{height: '100%', left: '0', position: 'absolute', top: '0', width: '100%'}}>
                <ReactPlayer url="https://getleda.wistia.com/medias/t5mwooeubw"
                             className="video"
                             width="100%"
                             height="100%"
                controls={true} style={{borderRadius: '20px', overflow: "hidden"}}/>
              </div>
            </div>
          </Grid>
        </Grid>
        </Page>
    )
};

export default Index;