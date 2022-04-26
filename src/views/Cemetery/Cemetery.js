import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Paper, Card, CardContent, Typography, Grid } from '@mui/material';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import CemeteryCard from './CemeteryCard';
import { createGlobalStyle } from 'styled-components';

import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';

import useBanks from '../../hooks/useBanks';
import useTreasury from "../../hooks/useTreasury";
import useFetchMasonryAPR from '../../hooks/useFetchMasonryAPR';
import useEarningsOnMasonry from '../../hooks/useEarningsOnMasonry';

import { getDisplayBalance } from '../../utils/formatBalance';
import useTombStats from '../../hooks/useTombStats';

import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useStakedBalanceOnMasonry from '../../hooks/useStakedBalanceOnMasonry';
import useTombFinance from '../../hooks/useTombFinance';

import useTokenBalance from '../../hooks/useTokenBalance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

import { makeStyles } from '@mui/styles';
import useFetchDungeonAPR from "../../hooks/useFetchDungeonAPR";
import useEarningsOnDungeon from "../../hooks/useEarningsOnDungeon";
import useStakedBalanceInTheoryOnDungeon from "../../hooks/useStakedBalanceInTheoryOnDungeon";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: '100px 0',
    '@media (max-width: 767px)': {
      padding: '40px 0'
    }
  },
}));

const Cemetery = () => {
  const [banks] = useBanks();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const activeBanks = banks.filter((bank) => !bank.finished);
  const classes = useStyles();
  const { apr, dpr } = useFetchMasonryAPR();
  const dungeonStats = useFetchDungeonAPR();
  const dungeonapr = dungeonStats.apr;
  const dungeondpr = dungeonStats.dpr;
  const rebateStats = useTreasury()

  const tombStats = useTombStats();
  const earnings = useEarningsOnMasonry();
  const dungeonEarnings = useEarningsOnDungeon();

  const tokenPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings)));
  const dungeonEarnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(dungeonEarnings)));


  const tombFinance = useTombFinance();
  const stakedBalance = useStakedBalanceOnMasonry();
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('THEORY', tombFinance.TSHARE);
  const stakedPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance)))
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );

  const dungeonStakedBalanceInTheory = useStakedBalanceInTheoryOnDungeon();
  const dungeonStakedPriceInDollars = useMemo(
      () =>
          stakedTokenPriceInDollars
              ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(dungeonStakedBalanceInTheory)))
              : null,
      [stakedTokenPriceInDollars, stakedBalance],
  );

  const bondBalance = useTokenBalance(tombFinance?.HODL);
  const cashPrice = useCashPriceInLastTWAP();

  const priceWithCommas = (x) => {
    if(x === null) return x;
    return x.toLocaleString('en-US');
  }

  const numberWithCommas = (x) => {
    if(x === null) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          {!!account ? (
            <Paper maxwidth="lg" className="section">


              <Typography align="center" variant="h2" className="textGlow pink" style={{marginBottom: '50px'}}>
                Liquidity Pools
              </Typography>

              <Grid container justifyContent="center" spacing={3}>

                {activeBanks
                  .filter((bank) => bank.sectionInUI === 2)
                  .map((bank) => (
                    <React.Fragment key={bank.name}>
                      <CemeteryCard bank={bank} classname="boxed link" />
                    </React.Fragment>
                ))}
              </Grid>

    
              <Typography align="center" variant="h2" className="textGlow pink" style={{marginTop: '100px', marginBottom: '50px'}}>
                THEORY Staking Pool
              </Typography>

              <Grid container justifyContent="center" spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card className="boxed link">
                    <CardContent align="center">
                      <Link to="/theoretics" style={{textDecoration: 'none',color: 'inherit'}}>
                      <Box style={{marginBottom: '20px'}}>
                        <CardIcon>
                          <TokenSymbol symbol="TSHARE" />
                        </CardIcon>
                      </Box>
                      <Typography variant="h4" className="kallisto" style={{marginBottom: '20px'}}>
                        Theoretics Pool
                      </Typography>
                      <Typography variant="body1" style={{marginBottom: '20px'}}>
                        Deposit THEORY & earn GAME when GAME price is above $1.01
                      </Typography>
                      <div className='info-wrap'>
                      <Grid container spacing={3}>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            {numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? apr.toFixed(2) : "0.00")}%
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">Yearly Rewards</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            {numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? dpr.toFixed(2) : "0.00")}%
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">Daily Rewards</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            ${numberWithCommas(stakedPriceInDollars.toFixed(2))}
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">Staked Value</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            ${numberWithCommas(earnedInDollars.toFixed(2))}
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">Total Earned</Typography>
                        </Grid>

                      </Grid>
                      </div>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="boxed link">
                    <CardContent align="center">
                      <Link to="/dungeon" style={{textDecoration: 'none',color: 'inherit'}}>
                        <Box style={{marginBottom: '20px'}}>
                          <CardIcon>
                            <TokenSymbol symbol="MASTER" />
                          </CardIcon>
                        </Box>
                        <Typography variant="h4" className="kallisto" style={{marginBottom: '20px'}}>
                          Dungeon Pool
                        </Typography>
                        <Typography variant="body1" style={{marginBottom: '20px'}}>
                          Lock up THEORY as MASTER for 1 year & earn bonuses + GAME when GAME price is above $1.01
                        </Typography>
                        <div className='info-wrap'>
                          <Grid container spacing={3}>

                            <Grid item xs={6}>
                              <Typography variant="h4" color="var(--extra-color-2)">
                                {numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? dungeonapr.toFixed(2) : "0.00")}%
                              </Typography>
                              <Typography variant="body1" component="p" className="textGlow">Yearly Rewards</Typography>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography variant="h4" color="var(--extra-color-2)">
                                {numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? dungeondpr.toFixed(2) : "0.00")}%
                              </Typography>
                              <Typography variant="body1" component="p" className="textGlow">Daily Rewards</Typography>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography variant="h4" color="var(--extra-color-2)">
                                ${numberWithCommas(dungeonStakedPriceInDollars.toFixed(2))}
                              </Typography>
                              <Typography variant="body1" component="p" className="textGlow">Staked Value</Typography>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography variant="h4" color="var(--extra-color-2)">
                                ${numberWithCommas(dungeonEarnedInDollars.toFixed(2))}
                              </Typography>
                              <Typography variant="body1" component="p" className="textGlow">Total Earned</Typography>
                            </Grid>

                          </Grid>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography align="center" variant="h2" className="textGlow pink" style={{marginTop: '100px', marginBottom: '50px'}}>
                HODL (Bonds)
              </Typography>

              <Grid container justifyContent="center" spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card className="boxed link">
                    <CardContent align="center">
                      <Link to="/bonds" style={{textDecoration: 'none',color: 'inherit'}}>
                      <Box style={{marginBottom: '20px'}}>
                        <CardIcon>
                          <TokenSymbol symbol="HODL" />
                        </CardIcon>
                      </Box>
                      <Typography variant="h4" className="kallisto" style={{marginBottom: '20px'}}>
                        Buy or Redeem Bonds
                      </Typography>
                      <Typography variant="body1" style={{marginBottom: '20px'}}>     
                        Swap GAME for HODL when GAME is below $1.00 and earn premiums upon redemption
                      </Typography>
                      <div className='info-wrap'>
                      <Grid container spacing={3}>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            {getDisplayBalance(cashPrice, 18, 4)} DAI
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">GAME Price (TWAP)</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h4" color="var(--extra-color-2)">
                            {getDisplayBalance(bondBalance)}
                          </Typography>
                          <Typography variant="body1" component="p" className="textGlow">Deposits</Typography>
                        </Grid>

                      </Grid>
                      </div>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>


            </Paper>
          ) : (
            <UnlockWallet />
          )}
        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

export default Cemetery;
