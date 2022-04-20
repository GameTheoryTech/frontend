import React from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { makeStyles } from '@mui/styles';
import useTreasury from "../../hooks/useTreasury"

import { Card, CardContent, Button, Typography, Grid, Paper } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ExpandMore as ChevronDownIcon } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import useRedeemOnMasonry from '../../hooks/useRedeemOnMasonry';
import useStakedBalanceOnMasonry from '../../hooks/useStakedBalanceOnMasonry';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchMasonryAPR from '../../hooks/useFetchMasonryAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useCashPriceInNextTWAP from '../../hooks/useCashPriceInNextTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalTVLOnMasonry from '../../hooks/useTotalTVLOnMasonry';
import useClaimRewardCheck from '../../hooks/masonry/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/masonry/useWithdrawCheck';
import ProgressCountdown from './components/ProgressCountdown';
// import MasonryImage from '../../assets/img/masonry.png';
import useTotalStakedOnMasonry from "../../hooks/useTotalStakedOnMasonry";
import useShareStats from "../../hooks/usetShareStats";

import useModal from '../../hooks/useModal';
import Modal, { ModalProps } from '../../components/Modal';
import ModalActions from '../../components/ModalActions';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: '100px 0',
    '@media (max-width: 767px)': {
      padding: '40px 0'
    }
  },
  button : {
    width: '2em',
    height: '2em',
    fontSize: '14px',
    padding: '0',
    minWidth: 'auto'
  },
  boxed : {
    overflow: 'initial',
    '& .info-wrap': {
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        width: '2px',
        height: 'calc(100% - 20px)',
        background: 'var(--extra-color-1)',
        left: '50%',
        bottom: '0',
        transform: 'translateX(-50%)',
        boxShadow: "0px 0px 5px var(--extra-color-1)",

      }
    }
  },
  boxClear: {
    border: 'none',
    boxShadow: 'none',
    backdropFilter: 'none',
    '& > *': {
      padding: '0',
      '&:last-child': {
        paddingBottom: '0'
      }
    },
  },
  advanced: {
    textAlign: 'center',
    '& .advanced-toggle' : {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
    '& .advanced-info' : {
      display: 'none',
      marginBottom: '20px'
    },
    '&.open' : {
      '& .advanced-info' : {
        display: 'block',
      },
      '& .advanced-toggle' : {
        '& svg' : {
          transform: 'rotate(180deg)'
        }
      }
    }
  },
}));

const numberWithCommas = (x) => {
  if(x === null) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Masonry = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnMasonry();
  const stakedBalance = useStakedBalanceOnMasonry();
  const currentEpoch = useCurrentEpoch();
  //const cashStat = useCashPriceInEstimatedTWAP();
  //const nextCashStat = useCashPriceInNextTWAP();
  const totalTVL = useTotalTVLOnMasonry();
  const totalStaked = useTotalStakedOnMasonry();
  const { apr, dpr } = useFetchMasonryAPR();
  const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  //const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const rebateStats = useTreasury()
  const theoryStats = useShareStats();

  const [AdvancedOpen, setAdvancedOpen] = React.useState(false);

  const handleAdvancedOpen = () => {
    (AdvancedOpen === false) ? setAdvancedOpen(true) : setAdvancedOpen(false);
  };

  const handleRewardsClose = () => {
    onCloseRewards();
  };
  
  const [onHandleRewards, onCloseRewards] = useModal(
    <Modal text="Rewards" onDismiss={handleRewardsClose}>
      <Typography variant="h6" color="#fff" style={{fontWeight: '500'}}>
      Every Round (often called an 'Epoch' in other DeFi protocols) you will recieve rewards based on the yearly and daily percentage rates if the GAME Price is above $1.01. Rewards are paid in GAME and LGAME (Locked GAME) tokens.<br /><br />

      <strong>GAME</strong><br />Are GAME tokens which are available to you straight away.<br /><br />

      <strong>LGAME</strong><br />Locked GAME Tokens are claimable and they unlock over 1 year from claiming them in a real-time linear schedule.<br /><br />

      <strong>Unlocking LGAME</strong><br />You can view and unlock LGAME tokens which are available to be unlocked in 'my wallet'.<br /><br />

      <strong>Round</strong><br />A round lasts for 6 hours.<br /><br />

      <strong>TWAP</strong><br />Time-Weighted Average Price of GAME during the course of the previous Round.
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleRewardsClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );

  const handleStatsClose = () => {
    onCloseStats();
  };
  
  const [onHandleStats, onCloseStats] = useModal(
    <Modal text="Advanced Stats" onDismiss={handleStatsClose}>
      <Typography variant="h6" color="#fff" style={{fontWeight: '500'}}>
      <strong>LGAME %</strong><br />The percentage of your rewards that will be in Locked GAME Tokens. This percentage is based on the price of GAME for that Round.<br /><br />
      
      If the price is below $1.0, no rewards will be given.<br />
      If the price is $1.01, 100% of rewards will be in LGAME.<br />
      If the price is $4.00 or greater, 100% of rewards will be in GAME.<br />
      If the price is in between $1.01 and $4.00, the percentage of LGAME / GAME rewards will be on a linear sliding scale.<br /><br />

      <strong>Next TWAP</strong><br />The projected Time-Weighted Average Price of GAME for the next Round.<br /><br />

      <strong>Next APR</strong><br />The projected Annual Percentage Rate of rewards for the next Round.<br /><br />

      <strong>Next DPR</strong><br />The projected Daily Percentage Rate of rewards for the next Round.<br /><br />

      <strong>Next LGAME %</strong><br />The projected percentage of rewards that will be in Locked GAME for the next Round.<br /><br />

      <strong>Total Value Locked</strong><br />The total USD value of THEORY tokens staked in the pool.<br /><br />

      <strong>THEORY Staked</strong><br />The total number of THEORY tokens staked in the pool.<br /><br />

      <strong>THEORY Staked %</strong><br />The percentage of all circulating THEORY and Locked THEORY tokens that are staked in the pool.
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleStatsClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );

  return (
    <Page>
      {!!account ? (
        <>
          {/*<Alert variant="filled" severity="info" style={{ marginTop: '50px' }}>*/}
          {/*  Theoretics will start at {(new Date('2022-03-28T12:00:00Z')).toString()}.*/}
          {/*</Alert>*/}
          <div className="section">
          <Typography align="center" variant="h1" className="textGlow pink" style={{marginBottom: '20px'}}>
            Theoretics
          </Typography>
          <Typography align="center" variant="h5" component="p" style={{marginBottom: '50px', fontWeight: '500'}}>
            Deposit THEORY and earn GAME when GAME price is above $1.01
          </Typography>
          {/*<Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
            Withdrawing any amount also claims your rewards. The amount of rewards locked increases the closer to under-peg GAME is. At 1.01 or lower, it is 95%. At 4.0 or higher, it is 0%. You get your rewards after the epoch is over if the TWAP (time-weighted average price) is greater or equal to 1.01.{rebateStats.outOfBootstrap ? "" : " Also, the bootstrap phase is ongoing for " + rebateStats.bootstrapEpochsLeft + " more epochs, so GAME is being printed regardless of the TWAP right now."} You can find your locked LGAME rewards using the My Wallet button. View the docs for more info.
      </Alert>*/}
          <Grid container justifyContent="center" spacing={3} style={{marginBottom: '50px'}}>

            <Grid item xs={12} md={3}>
                <Card className={classes.boxClear}>
                  <CardContent align="center">
                    <Typography variant="body1" component="p" className="textGlow">Current Round</Typography>
                    <Typography variant="h4">{Number(currentEpoch)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

            <Grid item xs={6} md={3}>
              <Card className={classes.boxClear}>
                <CardContent align="center">
                  <Typography variant="body1" component="p" className="textGlow">
                    GAME Price<small> (TWAP)</small>
                  </Typography>
                  <Typography variant="h4">{rebateStats.tombPrice.toFixed(4)} DAI</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} md={3}>
              <Card className={classes.boxClear}>
                <CardContent align="center">
                  <Typography variant="body1" component="p" className="textGlow">Next Round</Typography>
                  <Typography variant="h4">
                    <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Round" />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>


          <Grid container justifyContent="center" spacing={3} style={{marginBottom: '30px'}}>
            <Grid item xs={12} md={6}>
              <div>
              <Card className={classes.boxed}>
                <CardContent align="center">
                  <Typography variant='h4' className="kallisto" style={{marginBottom: '20px'}}>
                    Rewards
                    <Button variant="contained" className={classes.button} aria-label="More info" style={{ marginLeft: '10px' }} onClick={onHandleRewards}>
                      <QuestionMarkIcon fontSize='inherit' />
                    </Button>
                  </Typography>
                  <div className='info-wrap'>
                  <Grid container justify="center" spacing={3}>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (apr*(100.0-rebateStats.rewardsLocked)/100.0).toFixed(2) : "0.00" || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">GAME Yearly Awards</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (dpr*(100.0-rebateStats.rewardsLocked)/100.0).toFixed(2) : "0.00" || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">GAME Daily Awards</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (apr*rebateStats.rewardsLocked/100.0).toFixed(2) : "0.00" || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">LGAME Yearly Awards</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPrice >= 1.01) ? (dpr*rebateStats.rewardsLocked/100.0).toFixed(2) : "0.00" || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">LGAME Daily Awards</Typography>
                    </Grid>

                  </Grid>
                  </div>
                </CardContent>
              </Card>
              </div>
              <div className={`${classes.advanced} ${AdvancedOpen ? 'open' : ''}`}>
                <div className='advanced-toggle' onClick={handleAdvancedOpen}>
                  <Typography align="center" style={{display: 'inline-block',cursor: 'pointer',fontWeight: '700'}} className='textGlow pink'>
                    <span style={{verticalAlign: 'middle'}}>{AdvancedOpen ? "Hide Advanced" : "Show Advanced"}</span>
                    <ChevronDownIcon style={{verticalAlign: 'middle'}} />
                  </Typography>
                </div>
                <div className="advanced-info">
                  <Card>
                    <CardContent align="center">
                      <Typography variant='h4' className="kallisto" style={{marginBottom: '10px'}}>
                        Advanced Stats
                        <Button variant="contained" className={classes.button} aria-label="Advanced stats info" style={{ marginLeft: '10px' }} onClick={onHandleStats}>
                          <QuestionMarkIcon fontSize='inherit' />
                        </Button>
                      </Typography>
                      <Grid container>
                        <TableContainer component={Paper}>
                          <Table aria-label="advanced info table">
                            <TableBody>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    LGAME %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {(rebateStats.rewardsLocked).toFixed(2)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    Next TWAP
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {rebateStats.tombPriceUpdated.toFixed(4)} DAI
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    Next APR
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (apr*(100.0-rebateStats.nextRewardsLocked)/100.0).toFixed(2) : "0.00" || '0.00')}% GAME<br />{numberWithCommas((!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (apr*rebateStats.nextRewardsLocked/100.0).toFixed(2) : "0.00" || '0.00')}% LGAME
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    Next DPR
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (dpr*(100.0-rebateStats.nextRewardsLocked)/100.0).toFixed(2) : "0.00"}% GAME<br />{(!rebateStats.outOfBootstrap || rebateStats.tombPriceUpdated >= 1.01) ? (dpr*rebateStats.nextRewardsLocked/100.0).toFixed(2) : "0.00"}% LGAME
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    Next LGAME %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {(rebateStats.nextRewardsLocked).toFixed(2)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    Total Value Locked
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    ${numberWithCommas(totalTVL.toFixed(2) || '0.00')}
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    THEORY Staked
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {numberWithCommas(getDisplayBalance(totalStaked) || '0.00')}
                                  </Typography>
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    THEORY Staked %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {((Number(getDisplayBalance(totalStaked))/(Number(theoryStats?.circulatingSupply)/*-(28555.3529+25959.4118)*/))*100).toFixed(2)}%<br />(Circulating + Locked)
                                  </Typography>
                                </TableCell>
                              </TableRow>

                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Grid>
          </Grid>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Harvest rewardsLocked={rebateStats.rewardsLocked} classname="boxed" />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stake withdrawPercentage={(rebateStats.currentWithdrawFeeOf / 100).toFixed(2)} classname="boxed" />
              </Grid>
            </Grid>

          </div>
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

export default Masonry;
