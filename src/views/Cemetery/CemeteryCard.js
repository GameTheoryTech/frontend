import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
import useStatsForPool from '../../hooks/useStatsForPool';

import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import { getDisplayBalance } from '../../utils/formatBalance';

import useTombStats from '../../hooks/useTombStats';
import useShareStats from '../../hooks/usetShareStats';
import useEarnings from '../../hooks/useEarnings';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  blueGlow: {
    color: 'var(--extra-color-1)',
    textShadow: '0px 0px 20px var(--extra-color-1)'
  },
}));

const CemeteryCard = ({ bank, classname }) => {
  classname = classname || '';
  const classes = useStyles();

  const statsOnPool = useStatsForPool(bank);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const stakedPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const stakedInDollars = (
    Number(stakedPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);

  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const tombStats = useTombStats();
  const tShareStats = useShareStats();
  const tokenStats = bank.earnTokenName === 'THEORY' ? tShareStats : tombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const numberWithCommas = (x) => {
    if(x === null) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Grid item xs={12} md={4}>
      <Card className={classname}>
        <CardContent align="center">
          <Link to={`/farms/${bank.page}`} style={{textDecoration: 'none',color: 'inherit'}}>
            <Box className="icon-pools" style={{marginBottom: '20px'}}>
              <CardIcon>
                <TokenSymbol symbol={bank.depositTokenName} />
              </CardIcon>
              <CardIcon>
                <TokenSymbol symbol="DAI" />
              </CardIcon>
            </Box>
            <Typography variant="h4" className="kallisto" style={{marginBottom: '20px'}}>
              {bank.depositTokenName.replace('LP', '')} Pool
            </Typography>
            <Typography variant="body1" style={{marginBottom: '20px'}}>
              {/* {bank.name} */}
              Deposit {bank.depositTokenName} tokens and Earn {` ${bank.earnTokenName}`}
            </Typography>
            <div className='info-wrap'>
              <Grid container spacing={3}>

                <Grid item xs={6}>
                  <Typography variant="h4" color="var(--extra-color-2)">
                    {numberWithCommas(bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR || '0.00')}%
                  </Typography>
                  <Typography variant="body1" component="p" className={classes.blueGlow}>Yearly Rewards</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h4" color="var(--extra-color-2)">
                    {numberWithCommas(bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR || '0.00')}%
                  </Typography>
                  <Typography variant="body1" component="p" className={classes.blueGlow}>Daily Rewards</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h4" color="var(--extra-color-2)">
                    ${numberWithCommas(stakedInDollars || '0.00')}
                  </Typography>
                  <Typography variant="body1" component="p" className={classes.blueGlow}>Staked Value</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h4" color="var(--extra-color-2)">
                    ${numberWithCommas(earnedInDollars || '0.00')}
                  </Typography>
                  <Typography variant="body1" component="p" className={classes.blueGlow}>Total Earned</Typography>
                </Grid>

              </Grid>
            </div>
          </Link>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CemeteryCard;
