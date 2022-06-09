import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch, Link } from 'react-router-dom';
import Bank from '../Bank';

import { Box, Paper, Card, CardContent, Typography, Grid } from '@mui/material';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import MigrationCard from './MigrationCard';
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

const Migration = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const whitelistedTokens = [
    {address: "0x56EbFC2F3873853d799C155AF9bE9Cb8506b7817", migrationMultiplier: "1.0", name: "GAME"},
    {address: "0x60787C689ddc6edfc84FCC9E7d6BD21990793f06", migrationMultiplier: "1.0", name: "THEORY"},
    {address: "0xFfF54fcdFc0E4357be9577D8BC2B4579ce9D5C88", migrationMultiplier: "1.1", name: "HODL"},
    {address: "0x83641AA58E362A4554e10AD1D120Bf410e15Ca90", migrationMultiplier: "2.0", name: "MASTER"},
    {address: "0x168e509FE5aae456cDcAC39bEb6Fd56B6cb8912e", migrationMultiplier: "1.0", name: "GAME-DAI"},
    {address: "0xF69FCB51A13D4Ca8A58d5a8D964e7ae5d9Ca8594", migrationMultiplier: "1.0", name: "THEORY-DAI"}]

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          {!!account ? (
            <Paper maxwidth="lg" className="section">


              <Typography align="center" variant="h2" className="textGlow pink" style={{marginBottom: '50px'}}>
                Migration
              </Typography>
              <Typography align="center">Those with an NFT will automatically get airdropped a new one on Avalanche upon launch. There is no need to migrate your NFT because there are no calculations required.</Typography>
              <br/>
              <Grid container justifyContent="center" spacing={3}>

                {whitelistedTokens
                  .map((token) => (
                    <React.Fragment key={token.name}>
                      <MigrationCard token={token} classname="boxed link" />
                    </React.Fragment>
                ))}
              </Grid>


            </Paper>
          ) : (
            <UnlockWallet />
          )}
        </Route>
      </Page>
    </Switch>
  );
};

export default Migration;
