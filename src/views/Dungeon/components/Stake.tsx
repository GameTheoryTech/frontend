import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawCheck from '../../../hooks/dungeon/useWithdrawCheck';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useTombFinance from '../../../hooks/useTombFinance';
import ProgressCountdown from './../components/ProgressCountdown';
import useStakedBalanceOnDungeon from '../../../hooks/useStakedBalanceOnDungeon';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
//import useUnstakeTimerDungeon from '../../../hooks/dungeon/useUnstakeTimerDungeon';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToDungeon from '../../../hooks/useStakeToDungeon';
import useWithdrawFromDungeon from '../../../hooks/useWithdrawFromDungeon';
import useStakedBalanceInTheoryOnDungeon from "../../../hooks/useStakedBalanceInTheoryOnDungeon";
import QuestionMark from "@mui/icons-material/QuestionMark";
import {makeStyles} from "@mui/styles";

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
  classname: string;
}

const numberWithCommas = (x: string) => {
  if(x === null) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stake: React.FC<StakeProps> = ({classname}) => {
  classname = classname || '';
  const classes = useStyles();
  const tombFinance = useTombFinance();
  const [approveStatus, approve] = useApprove(tombFinance?.TSHARE, tombFinance?.contracts.Master.address);

  const tokenBalance = useTokenBalance(tombFinance?.TSHARE);
  const stakedBalance = useStakedBalanceOnDungeon();
  const stakedBalanceInTheory = useStakedBalanceInTheoryOnDungeon();
  //const { from, to } = useUnstakeTimerDungeon();

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('THEORY', tombFinance?.TSHARE);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalanceInTheory))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const { onStake } = useStakeToDungeon();
  //const { onWithdraw } = useWithdrawFromDungeon();
  //const canWithdrawFromDungeon = useWithdrawCheckDungeon();

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

  // const [onPresentWithdraw, onDismissWithdraw] = useModal(
  //   <WithdrawModal
  //     max={stakedBalance}
  //     onConfirm={(value) => {
  //       onWithdraw(value);
  //       onDismissWithdraw();
  //     }}
  //     tokenName={'MASTER'}
  //   />,
  // );

  return (
      <>
        <Card className={classname}>
          <CardContent>
            <Box style={{marginBottom: '20px'}}>
              <CardIcon>
                <TokenSymbol symbol="MASTER" />
              </CardIcon>
            </Box>

            <Typography variant="h4">
              <Value value={getDisplayBalance(stakedBalance)} />
            </Typography>
            <Typography variant="h4" component="p" color="var(--extra-color-2)">
              ${numberWithCommas(tokenPriceInDollars || '0.00')}
            </Typography>
            <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
              MASTER In Wallet
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
                      Minimum Lockup: 1 year
                    </Typography>
                    <Button variant="contained" disabled={true} style={{marginRight: '15px'}}>
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
        {/*<Box mt={2} style={{ color: '#FFF' }}>*/}
        {/*  {canWithdrawFromMasonry ? (*/}
        {/*      ''*/}
        {/*  ) : (*/}
        {/*      <Card>*/}
        {/*        <CardContent>*/}
        {/*          <Typography style={{ textAlign: 'center' }}>Withdraw possible in</Typography>*/}
        {/*          <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*  )}*/}
        {/*</Box>*/}
      </>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
