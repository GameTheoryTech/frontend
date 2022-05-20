import React, { useMemo } from 'react';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import CardIcon from '../../../components/CardIcon';
import QuestionMark from '@mui/icons-material/QuestionMark';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawCheck from '../../../hooks/masonry/useWithdrawCheck';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useTombFinance from '../../../hooks/useTombFinance';
import ProgressCountdown from './../components/ProgressCountdown';
import useStakedBalanceOnMasonry from '../../../hooks/useStakedBalanceOnMasonry';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useUnstakeTimerMasonry from '../../../hooks/masonry/useUnstakeTimerMasonry';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToMasonry from '../../../hooks/useStakeToMasonry';
import useWithdrawFromMasonry from '../../../hooks/useWithdrawFromMasonry';

import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';

const useStyles = makeStyles((theme) => ({
  button : {
    width: '2em',
    height: '2em',
    fontSize: '14px',
    padding: '0',
    minWidth: 'auto'
  }
}));

interface StakeProps {
  withdrawPercentage: number;
  currentWithdrawEpochs: number;
  classname: string;
}

const numberWithCommas = (x: string) => {
  if(x === null) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stake: React.FC<StakeProps> = ({withdrawPercentage, currentWithdrawEpochs, classname}) => {
  classname = classname || '';
  withdrawPercentage = withdrawPercentage || 0;
  const classes = useStyles();

  const tombFinance = useTombFinance();
  const [approveStatus, approve] = useApprove(tombFinance?.TSHARE, tombFinance?.contracts.Theoretics.address);

  const tokenBalance = useTokenBalance(tombFinance?.TSHARE);
  const stakedBalance = useStakedBalanceOnMasonry();
  const { from, to } = useUnstakeTimerMasonry();

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('THEORY', tombFinance?.TSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useStakeToMasonry();
  const { onWithdraw } = useWithdrawFromMasonry();
  const canWithdrawFromMasonry = useWithdrawCheck();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'THEORY'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      withdrawPercentage={withdrawPercentage}
      tokenName={'THEORY'}
    />,
  );

  const handleModalClose = () => {
    onCloseModal();
  };
  
  const [onHandleModal, onCloseModal] = useModal(
    <Modal text="Withdrawal Fee" onDismiss={handleModalClose}>
      <Typography variant="h6" color="#fff" style={{marginBottom: '20px', fontWeight: "500"}}>
        Your withdrawal fee for each pool changes the longer your tokens are staked, from your initial deposit or last withdrawal.
      </Typography>
      <Typography variant="h6" color="#fff" style={{marginBottom: '20px', fontWeight: "500"}}>
        <strong>The fees are as follows:</strong>
        <ul style={{marginTop:'10px'}}>
          <li>1 block (30 seconds) = 25%</li>
          <li>less than 1 hour = 8%</li>
          <li>less than 1 day = 4%</li>
          <li>less than 3 days = 2%</li>
          <li>less than 5 days = 1%</li>
          <li>less than 2 weeks = 0.5%</li>
          <li>less than 4 weeks = 0.25%</li>
          <li>4 weeks and longer  = 0.01%</li>
        </ul>
      </Typography>
      <Typography variant="h6" color="#fff">
        Depositing or Claiming tokens does not reset your withdrawal fee.
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleModalClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );


  return (
    <>
      <Card className={classname}>
        <CardContent>
          <Box style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="TSHARE" />
            </CardIcon>
          </Box>

          <Typography variant="h4">
            <Value value={getDisplayBalance(stakedBalance)} />
          </Typography>
          <Typography variant="h4" component="p" color="var(--extra-color-2)">
            ${numberWithCommas(tokenPriceInDollars || '0.00')}
          </Typography>
          <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
            THEORY Staked
          </Typography>
          <Typography variant="body1" component="p" style={{marginBottom: '20px'}}>
            Withdraw Lockup Rounds: {currentWithdrawEpochs}
          </Typography>

              {approveStatus !== ApprovalState.APPROVED ? (
                <Box className="buttonWrap">
                  <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  variant="contained"
                  style={{ marginTop: '20px' }}
                  onClick={approve}
                  >
                    Approve THEORY
                  </Button>
                </Box>
              ) : (
                <>
                <Box className="buttonWrap">
                  <Typography variant="body1" component="p" style={{marginBottom: '20px'}}>
                    Current Withdrawal Fee: {withdrawPercentage}%
                    <Button variant="contained" className={classes.button} aria-label="More info" style={{ marginLeft: '10px' }} onClick={onHandleModal}>
                      <QuestionMark fontSize="inherit" />
                    </Button>
                  </Typography>
                  <Button variant="contained" disabled={!canWithdrawFromMasonry} onClick={onPresentWithdraw} style={{marginRight: '15px'}}>
                    Withdraw
                  </Button>
                  <Button variant="contained" onClick={onPresentDeposit}>
                    Deposit
                  </Button>
                  </Box>
                </>
              )}
        </CardContent>
      </Card>
      <Box mt={2} style={{ color: '#FFF' }}>
        {canWithdrawFromMasonry ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{ textAlign: 'center' }}>Withdraw possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default Stake;
