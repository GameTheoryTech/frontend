import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { Typography } from '@mui/material';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useFantomPrice from '../../hooks/useFantomPrice';
import { game as tombTesting, theory as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { game as tombProd, theory as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';

import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';

import { Box, Button, Card, CardContent, Grid, Paper } from '@mui/material';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@mui/styles';
import useTombFinance from '../../hooks/useTombFinance';

const numImg = {
  1: require('../../assets/img/01.png'),
  2: require('../../assets/img/02.png'),
  3: require('../../assets/img/03.png'),
}

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100%',
    display: 'block',
    marginTop: '40px'
  },
  section: {
    padding: '100px 0',
    '@media (max-width: 767px)': {
      padding: '40px 0'
    }
  },
  heading: {
    maxWidth: '100%',
    width: '500px',
    margin: '0 auto',
    fontWeight: '500'
  },
  box: {
    '& > *': {
      display: 'inline-block',
      width: '60px',
      borderRadius: '100%',
      boxShadow: '0px 0px 20px 0px var(--extra-color-1)'
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('GAME-DAI-LP');
  const tShareFtmLpStats = useLpStats('THEORY-DAI-LP');
  const tombStats = useTombStats();
  const tShareStats = usetShareStats();
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  const { price: ftmPrice, marketCap: ftmMarketCap, priceChange: ftmPriceChange } = useFantomPrice();
  //const { balance: rebatesTVL } = useTotalTreasuryBalance();
  const totalTVL = TVL;

  let tomb;
  let tShare;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //    tomb = tombTesting;
  //    tShare = tShareTesting;
  // } else
  {
    tomb = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = 'https://spooky.fi/swap?outputCurrency=' + tomb.address;
  const buyTShareAddress = 'https://spooky.fi/swap?outputCurrency=' + tShare.address;

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? Number(tombStats.circulatingSupply): null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? Number(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'GAME-DAI-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'THEORY-DAI-LP' });

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'GAME-DAI-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'THEORY-DAI-LP'}
    />,
  );

  // function to convert string to number with commas
  const numberWithCommas = (x) => {
    if(x === null) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Page>
        {/* Logo & bio */}
        <Grid container justifyContent="center" className="section" spacing={3}>
          <Grid item xs={12} style={{textAlign: 'center', marginBottom: '50px'}}>
            <Typography variant="h2" component="h1" className='textGlow pink' style={{marginBottom: '10px', textTransform: 'uppercase'}}>Game Theory</Typography>
            <Typography variant="h5" component="p" className={classes.heading}>The Revolutionary 'Play and Earn' Platform, Founded by a AAA Game Developer, Taking DeFi and Gaming to the Next Level!</Typography>
          </Grid>

          {/* TVL */}
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent align="center" style={{paddingBottom: '25px'}}>
                <Typography variant="h5" style={{marginBottom: '0'}}>Total Value Locked</Typography>
                <Typography variant="h2" style={{fontFamily: '"forma-djr-micro", sans-serif', fontWeight: '700', color: 'var(--extra-color-2)'}}><CountUp end={totalTVL} separator="," prefix="$" /></Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center">
        {/* TOMB */}
        <Grid item xs={12} md={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box style={{marginBottom: '20px'}}>
                <CardIcon>
                  <TokenSymbol symbol="TOMB" />
                </CardIcon>
              </Box>
              <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>GAME</Typography>
              <Typography variant="body1" component="p" className="textGlow">Current Price</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                  USD ${tombPriceInDollars ? tombPriceInDollars : '-.--'}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Liquidity</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                  ${numberWithCommas(tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--')}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Circulating Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                {numberWithCommas(tombCirculatingSupply)}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Total Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
              {numberWithCommas(tombTotalSupply)}
              </Typography>
              <Button
                target="_blank"
                href="https://spooky.fi/swap?outputCurrency=0x56EbFC2F3873853d799C155AF9bE9Cb8506b7817"
                variant="contained"
                className={classes.button}
              >
                Buy GAME
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* TSHARE */}
        <Grid item xs={12} md={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box style={{marginBottom: '20px'}}>
                <CardIcon>
                  <TokenSymbol symbol="TSHARE" />
                </CardIcon>
              </Box>
              <Typography variant="h3" component="h4" className="kallisto" style={{marginBottom: '20px'}}>THEORY</Typography>
              <Typography variant="body1" component="p" className="textGlow">Current Price</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                  USD ${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Liquidity</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                  ${numberWithCommas(tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--')}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Circulating Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                {numberWithCommas(tShareCirculatingSupply)}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Total Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px', color: 'var(--extra-color-2)'}}>
                {numberWithCommas(tShareTotalSupply)}
              </Typography>
              <Button variant="contained" target="_blank" href="https://spooky.fi/swap?outputCurrency=0x60787C689ddc6edfc84FCC9E7d6BD21990793f06" className={classes.button}>
                Buy THEORY
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* HODL
        <Grid item xs={12} sm={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box style={{marginBottom: '20px'}}>
                <CardIcon>
                  <TokenSymbol symbol="HODL" />
                </CardIcon>
              </Box>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px'}}>HODL</Typography>
              <Typography variant="body1" component="p" className="textGlow">Current Price</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px'}}>
                  USD ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Market Cap</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px'}}>
                  ${numberWithCommas((tBondCirculatingSupply * tBondPriceInDollars))}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Circulating Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px'}}>
                {numberWithCommas(tBondCirculatingSupply)}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">Total Supply</Typography>
              <Typography variant="h3" component="h4" style={{marginBottom: '20px'}}>
                {numberWithCommas(tBondTotalSupply)}
              </Typography>
              <Button variant="contained" href="/hodl" className={classes.button}>
                Buy HODL
              </Button>
            </CardContent>
          </Card>
        </Grid>*/}
      </Grid>

        <Grid container className="section" spacing={3} align="center" style={{paddingBottom: '0'}}>
        <Grid item xs={12} style={{marginBottom: '40px'}}>
          <Typography variant="h2" component="h1" className='textGlow pink' style={{marginBottom: '10px'}}>How To Play</Typography>
          <Typography variant="h5" component="p" style={{fontWeight: '500'}}>Here is a strategy that new players can use to play GAME THEORY.</Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box className={classes.box} style={{marginBottom: '20px'}}>
                <img src={numImg[1].default} />
              </Box>
              <Typography variant="body2" component="p">Use DAI tokens to create GAME-DAI LP tokens and stake them to start earning daily THEORY token rewards</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box className={classes.box} style={{marginBottom: '20px'}}>
                <img src={numImg[2].default} />
              </Box>
              <Typography variant="body2" component="p">Claim your THEORY rewards and stake them in the 'Theoretics Pool' to earn more GAME tokens each 'round' (6 hours)</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card className="boxed">
            <CardContent align="center">
              <Box className={classes.box} style={{marginBottom: '20px'}}>
                <img src={numImg[3].default} />
              </Box>
              <Typography variant="body2" component="p">After the round ends, claim your GAME rewards and put 60% back in GAME-DAI, 30% in THEORY-DAI and keep 10% profit</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} style={{marginTop: '40px'}}>
          <Typography variant="body1" component="p" style={{color:'var(--accent)', marginBottom: '20px'}}>
            <em>Game Theory does not offer financial advice. <strong>DO NOT INVEST MORE THAN YOU ARE WILLING TO LOSE</strong>. Do your own research before investing. Investing is risky and may result in monetary loss. By using Game Theory or any of its products, you agree that the Game Theory team is not responsible for any financial losses.</em>
          </Typography>
        </Grid>
      </Grid>


    </Page>
  );
};

export default Home;
