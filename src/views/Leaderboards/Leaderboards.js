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
import useAltergeneStats from "../../hooks/useAltergeneStats";

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

const Leaderboards = () => {
  const classes = useStyles();
  const tombFinance = useTombFinance();
  const stats = useAltergeneStats();

  // function to convert string to number with commas
  const numberWithCommas = (x) => {
    if(x === null) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Page>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <strong>High Scores</strong>
              <ul style={{marginTop:'10px'}}>
                <li>{stats?.highScoreList[0]}</li>
                <li>{stats?.highScoreList[1]}</li>
                <li>{stats?.highScoreList[2]}</li>
                <li>{stats?.highScoreList[3]}</li>
                <li>{stats?.highScoreList[4]}</li>
                <li>{stats?.highScoreList[5]}</li>
                <li>{stats?.highScoreList[6]}</li>
                <li>{stats?.highScoreList[7]}</li>
                <li>{stats?.highScoreList[8]}</li>
                <li>{stats?.highScoreList[9]}</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent align="center">
            <strong>Challenges</strong>
            <ul style={{marginTop:'10px'}}>
              <li>Seasonal:</li>
              <li>Highest Level Score: {stats?.highestLevelScore}</li>
              <li>Most Enemies Defeated: {stats?.enemiesDefeated}</li>
              <li>Highest Level Reached: {stats?.levelReached}</li>
              <li>Most Powerups Collected: {stats?.powerupsCollected}</li>
              <li>Top Spender: {stats?.topSpender}</li>
              <li><br/></li>
              <li>Daily:</li>
              <li>Most Enemies Defeated: {stats?.dailyEnemiesDefeated}</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent align="center">
            <strong>Prizes</strong>
            <ul style={{marginTop:'10px'}}>
              <li>Seasonal:</li>
              <li>High Score: 500 GAME</li>
              <li>Highest Level Score: 250 GAME</li>
              <li>Most Enemies Defeated: 300 GAME</li>
              <li>Highest Level Reached: 250 GAME</li>
              <li>Most Powerups Collected: 250 GAME</li>
              <li>Top Spender: 30% back, 50% back if holding an NFT</li>
<li><br/></li>
              <li>Daily:</li>
              <li>Random User: 50 GAME</li>
              <li>Most Enemies Defeated: 50 GAME</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Page>
  );
};

export default Leaderboards;
