import React, { useMemo, useContext } from 'react';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CardIcon from '../../../components/CardIcon';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import QuestionMark from '@mui/icons-material/QuestionMark';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useZap from '../../../hooks/useZap';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../tomb-finance';

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
  bank: Bank;
  withdrawPercentage: string;
  classname: string;
}

const numberWithCommas = (x: string) => {
  if(x === null) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stake: React.FC<StakeProps> = ({ bank, withdrawPercentage, classname }) => {
  classname = classname || '';
  withdrawPercentage = withdrawPercentage || '';
  const classes = useStyles();

  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const { onStake } = useStake(bank);
  const { onZap } = useZap(bank);
  const { onWithdraw } = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      withdrawPercentage={withdrawPercentage}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const handleModalClose = () => {
    onCloseModal();
  };
  
  const [onHandleModal, onCloseModal] = useModal(
    <Modal text="Withdrawal Fee" onDismiss={handleModalClose}>
      <Typography variant="h6" color="#fff" style={{marginBottom: '20px',fontWeight: "500"}}>
        Your withdrawal fee for each pool changes the longer your tokens are staked, from your initial deposit or last withdrawal.
      </Typography>
      <Typography variant="h6" color="#fff" style={{marginBottom: '20px',fontWeight: "500"}}>
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
    <Card className={classname}>
      <CardContent>

      <Box className="icon-pools" style={{marginBottom: '20px'}}>
        <CardIcon>
          <TokenSymbol symbol={bank.depositToken.symbol} />
        </CardIcon>{

          bank.depositTokenName == "HODL" ? null : (<CardIcon>
              <TokenSymbol symbol="DAI"/>
          </CardIcon>)
      }
      </Box>

      <Typography variant="h4">
        <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} />
      </Typography>
      <Typography variant="h4" component="p" color="var(--extra-color-2)">
        ${numberWithCommas(earnedInDollars || '0.00')}
      </Typography>
      <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
        {bank.depositTokenName} Staked
      </Typography>

            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={
                  bank.closedForStaking ||
                  approveStatus === ApprovalState.PENDING ||
                  approveStatus === ApprovalState.UNKNOWN
                }
                onClick={approve}
                color="primary"
                variant="contained"
                style={{ marginTop: '20px' }}
              >
                {`Approve ${bank.depositTokenName}`}
              </Button>
            ) : (
              <>
                <Box className="buttonWrap">
                  <Typography variant="body1" component="p" style={{marginBottom: '20px'}}>
                    Current Withdrawal Fee {withdrawPercentage}%
                    <Button variant="contained" className={classes.button} aria-label="More info" style={{ marginLeft: '10px' }} onClick={onHandleModal}>
                      <QuestionMark fontSize="inherit" />
                    </Button>
                  </Typography>

                    { bank.depositTokenName == "HODL" ? null : (<Button
                  variant="contained"
                  disabled={bank.closedForStaking || bank.depositTokenName === 'GAME-DAI-LP'}
                  onClick={() => (bank.closedForStaking ? null : onPresentZap())}
                  style={{width: '100%', marginBottom: '20px'}}
                >

                  <span>Create Liquidity Pool Tokens</span>
                  {/*<FlashOnIcon style={{ color: '#fff', marginLeft: '10px' }} />*/}
                </Button>)
                      }
                <Button variant="contained" onClick={onPresentWithdraw} style={{width: "calc(50% - 7.5px)",marginRight: '15px'}}>
                  Withdraw
                </Button>
                <Button
                  variant="contained"
                  disabled={bank.closedForStaking}
                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                  style={{width: "calc(50% - 7.5px)"}}
                >
                  Deposit
                </Button>

                </Box>
              </>
            )}
      </CardContent>
    </Card>
  );
};

export default Stake;
