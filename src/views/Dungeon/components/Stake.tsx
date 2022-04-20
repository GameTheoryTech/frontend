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

const Stake: React.FC = () => {
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
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="TSHARE" />
              {/* TODO: "TSHARE" should be "MASTER" with new icon */}
              </CardIcon>
              <Value value={getDisplayBalance(stakedBalance)} />
              <Label text={`≈ $${tokenPriceInDollars}`} color="#89cff0" />
              <Label text={'MASTER In Wallet'} />
            </StyledCardHeader>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={approve}
                >
                  Approve THEORY
                </Button>
              ) : (
                <>
                  {/*<IconButton disabled={!canWithdrawFromDungeon} onClick={onPresentWithdraw}>*/}
                  <IconButton disabled={true}>
                    <RemoveIcon />
                  </IconButton>
                  <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon />
                  </IconButton>
                </>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      {/*<Box mt={2} style={{ color: '#FFF' }}>*/}
      {/*  {canWithdrawFromDungeon ? (*/}
      {/*    ''*/}
      {/*  ) : (*/}
      {/*    <Card>*/}
      {/*      <CardContent>*/}
      {/*        <Typography style={{ textAlign: 'center' }}>Withdraw possible in</Typography>*/}
      {/*        <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />*/}
      {/*      </CardContent>*/}
      {/*    </Card>*/}
      {/*  )}*/}
      {/*</Box>*/}
    </Box>
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
