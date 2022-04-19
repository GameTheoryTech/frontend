import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@mui/styles';
import useTreasury from "../../hooks/useTreasury"

import { Box, Card, CardContent, Button, Typography, Grid } from '@mui/material';

import { Alert } from '@mui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useStakedBalanceOnDungeon from '../../hooks/useStakedBalanceOnDungeon';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchDungeonAPR from '../../hooks/useFetchDungeonAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useCashPriceInNextTWAP from '../../hooks/useCashPriceInNextTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalTVLOnDungeon from '../../hooks/useTotalTVLOnDungeon';
import useWithdrawCheck from '../../hooks/dungeon/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
// import DungeonImage from '../../assets/img/dungeon.png';
import { createGlobalStyle } from 'styled-components';
import useTotalStakedOnDungeon from "../../hooks/useTotalStakedOnDungeon";
import useShareStats from "../../hooks/usetShareStats";
import usePriceOfMasterInTheory from "../../hooks/usePriceOfMasterInTheory";

// const BackgroundImage = createGlobalStyle`
//   body, html {
//     background: url(${DungeonImage}) no-repeat !important;
//     background-size: cover !important;
//   }
// `;

const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
}

* {
    border-radius: 0 !important;
    box-shadow: none !important;
}
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: var(--accent-light);
  `;

const Dungeon = () => {
  const classes = useStyles();
  const { account } = useWallet();
  //const { onRedeem } = useRedeemOnDungeon();
  const stakedBalance = useStakedBalanceOnDungeon();
  const currentEpoch = useCurrentEpoch();
  //const cashStat = useCashPriceInEstimatedTWAP();
  //const nextCashStat = useCashPriceInNextTWAP();
  const totalTVL = useTotalTVLOnDungeon();
  const totalStaked = useTotalStakedOnDungeon();
  const { apr, dpr } = useFetchDungeonAPR();
  const canWithdraw = useWithdrawCheck();
  //const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const rebateStats = useTreasury()
  const theoryStats = useShareStats();
  const price = Number(getDisplayBalance(usePriceOfMasterInTheory()));

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Alert variant="filled" severity="warning" style={{ marginTop: '50px' }}>
            This part of the site is under heavy construction. It's as safe to use as the rest of the site, but some features and visuals may be missing or later changed.
          </Alert>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            Dungeon
          </Typography>
          <Alert variant="filled" severity="info" style={{ marginBottom: '50px' }}>
            MASTER gives you voting rights on our <StyledLink href="https://snapshot.org/#/gametheorytech.eth">Snapshot</StyledLink>, as well as accumulation of fees and GAME rewards said from fees.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
            There is no withdraw fee for MASTER. However, there is a minimum lockup period of 365 days. Claiming GAME after your unlocked MASTER locks you up for 30 more days.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
            MASTER staking and withdrawing works based on the withdraw timer.
            The price of MASTER you sell it at depends on the price you request the withdraw.
            Claimable GAME and THEORY will be stored here during the last 30 minutes of every {rebateStats.currentWithdrawEpochs} {rebateStats.currentWithdrawEpochs == 1 ? "epoch" : "epochs"}.
            You also get MASTER immediately when you stake, but you don't start earning on it until this happens. You cannot withdraw with a pending stake, and you cannot stake with a pending withdraw.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
            Selling all your MASTER also claims your rewards. The amount of rewards locked increases the closer to under-peg GAME is. At 1.01 or lower, it is 95%. At 4.0 or higher, it is 0%. You get your rewards after the epoch is over if the TWAP (time-weighted average price) is greater or equal to 1.01.{rebateStats.outOfBootstrap ? "" : " Also, the bootstrap phase is ongoing for " + rebateStats.bootstrapEpochsLeft + " more epochs, so GAME is being printed regardless of the TWAP right now."} You can find your locked LGAME rewards using the My Wallet button. View the docs for more info.
          </Alert>
          <Box mt={5}>
            <Grid container justifyContent="center" rowSpacing={13} columnSpacing={3}>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent>
                    <Typography style={{ textAlign: 'center' }}>Next Epoch</Typography>
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Current Epoch</Typography>
                    <Typography>{Number(currentEpoch)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>
                      GAME Price<small> (TWAP)</small>
                    </Typography>
                    <Typography>{rebateStats.tombPrice.toFixed(4)} DAI</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>
                      Price<small> (Next TWAP)</small>
                    </Typography>
                    <Typography>{rebateStats.tombPriceUpdated.toFixed(4)} DAI</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Total APR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? apr.toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Total DPR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? dpr.toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>GAME APR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (apr*(100.0-rebateStats.rewardsLocked)/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>LGAME APR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (apr*rebateStats.rewardsLocked/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>GAME DPR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (dpr*(100.0-rebateStats.rewardsLocked)/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>LGAME DPR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (dpr*rebateStats.rewardsLocked/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>LGAME Percentage</Typography>
                    <Typography>{(rebateStats.rewardsLocked).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Next GAME APR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (apr*(100.0-rebateStats.nextRewardsLocked)/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Next LGAME APR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (apr*rebateStats.nextRewardsLocked/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Next GAME DPR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (dpr*(100.0-rebateStats.nextRewardsLocked)/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Next LGAME DPR</Typography>
                    <Typography>{(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (dpr*rebateStats.nextRewardsLocked/100.0).toFixed(2) : "0.00"}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Next LGAME Percentage</Typography>
                    <Typography>{(rebateStats.nextRewardsLocked).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Minimum Lock Period</Typography>
                    <Typography>1 year</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>MASTER Price</Typography>
                    <Typography>{price.toFixed(4)} (${(price*theoryStats?.priceInDollars).toFixed(2)})</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>TVL</Typography>
                    <Typography>${totalTVL.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
                <Card className={classes.gridItem}>
                  <CardContent align="center">
                    <Typography>Total Supply</Typography>
                    <Typography>{getDisplayBalance(totalStaked)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box mt={4}>
              <StyledBoardroom>
                <StyledCardsWrapper>
                  <StyledCardWrapper>
                    <Harvest rewardsLocked={rebateStats.rewardsLocked} />
                  </StyledCardWrapper>
                  <Spacer />
                  <StyledCardWrapper>
                    <Stake />
                  </StyledCardWrapper>
                </StyledCardsWrapper>
              </StyledBoardroom>
            </Box>

            {/* <Grid container justifyContent="center" spacing={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Rewards</Typography>

                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button color="primary" variant="outlined">Claim Reward</Button>
                </CardActions>
                <CardContent align="center">
                  <Typography>Claim Countdown</Typography>
                  <Typography>00:00:00</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent align="center">
                  <Typography>Stakings</Typography>
                  <Typography>{getDisplayBalance(stakedBalance)}</Typography>
                </CardContent>
                <CardActions style={{justifyContent: 'center'}}>
                  <Button>+</Button>
                  <Button>-</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid> */}
          </Box>
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default Dungeon;
