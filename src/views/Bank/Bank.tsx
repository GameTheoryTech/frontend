import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@mui/styles';

import { Box, Button, Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ExpandMore as ChevronDownIcon } from '@mui/icons-material';

import PageHeader from '../../components/PageHeader';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import useModal from '../../hooks/useModal';
import Modal, { ModalProps } from '../../components/Modal';
import ModalActions from '../../components/ModalActions';

const useStyles = makeStyles((theme : any) => ({
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
  boxed2 : {
    position: 'relative',
    border: '0',
    boxShadow: "none",
    overflow: 'initial',
    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: 'calc(100% - 4px)',
      height: 'calc(100% - 34px)',
      border: '2px solid var(--extra-color-1)',
      borderRadius: "20px",
      boxShadow: "0px 0px 5px var(--extra-color-1)",
    },
    '& > *': {
      position: 'relative',
      paddingTop: '0',
      height: 'calc(100% - 30px)',
      display: 'flex',
      flexDirection: 'column',
      '&:last-child': {
        paddingBottom: '30px'
      },
      '& .buttonWrap': {
        marginTop: 'auto'
      }
    },
    '& .blueGlow': {
      color: 'var(--extra-color-1)',
      textShadow: '0px 0px 20px var(--extra-color-1)'
    }
  },
}));

const numberWithCommas = (x: { toString: () => string; }) => {
  if(x === null) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//TODO: Get deposit fee from contract?
const Bank: React.FC<ModalProps> = ({ onDismiss }) => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);

  const [AdvancedOpen, setAdvancedOpen] = React.useState(false);

  const handleAdvancedOpen = () => {
    (AdvancedOpen === false) ? setAdvancedOpen(true) : setAdvancedOpen(false);
  };

  const handleRewardsClose = () => {
    onCloseRewards();
  };
  
  const [onHandleRewards, onCloseRewards] = useModal(
    <Modal text="Rewards" onDismiss={onDismiss}>
      <Typography variant="h6" color="#fff" align="center" style={{fontWeight: "500"}}>
      <strong>THEORY</strong><br />Are THEORY tokens which are available to you straight away.<br /><br />
      <strong>LTHEORY</strong><br />Locked THEORY Tokens are claimable however they are locked until March 24th, 2023. They then take 12 months to fully unlock.<br /><br />
      <strong>Unlocking LTHEORY</strong><br />some LTHEORY tokens can be unlocked early by using an NFT.
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
    <Modal text="Advanced Stats" onDismiss={onDismiss}>
      <Typography variant="h6" color="#fff" align="center" style={{fontWeight: "500"}}>
      <strong>LTHEORY %</strong><br />The percentage of your rewards if you claim that will be in Locked THEORY Tokens. This percentage decreases by 2% every week until March 24th, 2023 when all THEORY tokens will have been distributed.<br /><br />

      <strong>Total Value Locked</strong><br />The total USD value of tokens staked in the pool.
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleStatsClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );

  return account && bank ? (
    <>
      <div className="section">
      <Typography align="center" variant="h2" component="h1" className="textGlow pink" style={{marginBottom: '20px'}}>
        {bank?.depositTokenName.replace('LP', 'Liquidity')} Pool
      </Typography>
      <Typography align="center" variant="h5" component="p" style={{marginBottom: '50px', fontWeight: '500'}}>
        Deposit {bank?.depositTokenName} tokens & earn {bank?.earnTokenName}
      </Typography>
      <Grid container justifyContent="center" spacing={3} style={{marginBottom: '30px'}}>
            <Grid item xs={12} md={6}>
              <div>
              <Card className={classes.boxed}>
                <CardContent>
                  <Typography variant='h4' className="kallisto" style={{marginBottom: '20px'}}>
                    Rewards
                    <Button variant="contained" className={classes.button} aria-label="More info" style={{ marginLeft: '10px' }} onClick={onHandleRewards}>
                      <QuestionMarkIcon fontSize='inherit' />
                    </Button>
                  </Typography>
                  <div className='info-wrap'>
                  <Grid container justifyContent="center" spacing={3}>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas(bank.closedForStaking ? '0.00' : (Number(statsOnPool?.yearlyAPR)*(100.0-Number(statsOnPool?.locked))/100.0).toFixed(2) || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">{bank.earnTokenName} Yearly Rewards</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{bank.closedForStaking ? '0.00' : (Number(statsOnPool?.dailyAPR)*(100.0-Number(statsOnPool?.locked))/100.0).toFixed(2)}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">{bank.earnTokenName} Daily Rewards</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{numberWithCommas(bank.closedForStaking ? '0.00' : (Number(statsOnPool?.yearlyAPR)*Number(statsOnPool?.locked)/100.0).toFixed(2) || '0.00')}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">L{bank.earnTokenName} Yearly Rewards</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">{bank.closedForStaking ? '0.00' : (Number(statsOnPool?.dailyAPR)*Number(statsOnPool?.locked)/100.0).toFixed(2)}%</Typography>
                      <Typography variant="body1" component="p" className="textGlow">L{bank.earnTokenName} Daily Rewards</Typography>
                    </Grid>

                  </Grid>
                  </div>
                </CardContent>
              </Card>
              </div>
              <div className={`${classes.advanced} ${AdvancedOpen ? 'open' : ''}`}>
                <div className='advanced-toggle' onClick={handleAdvancedOpen}>
                  <Typography align="center" style={{display: 'inline-block',cursor: 'pointer', fontWeight: '700'}} className="textGlow pink">
                    <span style={{verticalAlign: 'middle'}}>{AdvancedOpen ? "Hide Advanced" : "Show Advanced"}</span>
                    <ChevronDownIcon style={{verticalAlign: 'middle'}} />
                  </Typography>
                </div>
                <div className="advanced-info">
                  <Card>
                    <CardContent>
                      <Typography variant='h4' className="kallisto" style={{marginBottom: '10px'}}>
                        Advanced Stats
                        <Button variant="contained" className={classes.button} aria-label="Advanced stats info" style={{ marginLeft: '10px' }} onClick={onHandleStats}>
                          <QuestionMarkIcon fontSize='inherit' />
                        </Button>
                      </Typography>
                      <Grid container justifyContent="center">
                        <TableContainer component={Paper} style={{width: 'initial'}}>
                          <Table aria-label="advanced info table">
                            <TableBody>

                              <TableRow>
                                <TableCell align="right">
                                  <Typography variant="body1" component="p" className="textGlow">
                                    L{bank.earnTokenName} %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {statsOnPool?.locked}%
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
                                    ${numberWithCommas(statsOnPool?.TVL || '0.00')}
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
          <Harvest bank={bank} rewardsLocked={Number(statsOnPool?.locked)} classname="boxed" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stake bank={bank} withdrawPercentage={statsOnPool?.fee} classname="boxed" />
        </Grid>
      </Grid>

      </div>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="Please return to the homepage and try again later." />
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
