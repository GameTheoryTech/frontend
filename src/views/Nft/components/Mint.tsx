import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';

import DepositModal from './DepositModal';
import useTombFinance from '../../../hooks/useTombFinance';
import TokenSymbol from '../../../components/TokenSymbol';
import useMintTheoryUnlocker from "../../../hooks/useMintTheoryUnlocker";
import useMaxLevel from "../../../hooks/useMaxLevel";
import useTheoryUnlockerTotalSupply from "../../../hooks/useTheoryUnlockerTotalSupply";
import useTheoryUnlockerOwnerSupply from "../../../hooks/useTheoryUnlockerOwnerSupply";
import useMintTheoryUnlockerGen1 from "../../../hooks/useMintTheoryUnlockerGen1";
import useTheoryUnlockerGen1OwnerSupply from "../../../hooks/useTheoryUnlockerGen1OwnerSupply";
import useTheoryUnlockerGen1TotalMinted from "../../../hooks/useTheoryUnlockerGen1TotalMinted";
import useTheoryUnlockerGen1Supply from "../../../hooks/useTheoryUnlockerGen1Supply";

const Mint: React.FC = () => {
  const tombFinance = useTombFinance();
  //const [approveStatus, approve] = useApprove(tombFinance.FTM, tombFinance.contracts.TheoryUnlocker.address);
  const [approveStatus, approve] = useApprove(tombFinance.FTM, tombFinance.contracts.TheoryUnlockerGen1.address);

  //const { onMint } = useMintTheoryUnlocker();
  const { onMint } = useMintTheoryUnlockerGen1();
  const maxLevel = useMaxLevel();
  const ownerSupply = useTheoryUnlockerOwnerSupply();
  const totalSupply = useTheoryUnlockerTotalSupply();
  const ownerSupplyGen1 = useTheoryUnlockerGen1OwnerSupply();
  const totalMinted = useTheoryUnlockerGen1TotalMinted(1);
  const supply = useTheoryUnlockerGen1Supply(1);


  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={maxLevel}
      onConfirm={(value) => {
        onMint(value);
        onDismissDeposit();
      }}
      tokenName={'Level'}
    />,
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="TSHARE" />
              </CardIcon>

              <Label text={`You have ${ownerSupply.toNumber()} out of ${totalSupply.toNumber()} ${totalSupply.eq(1) ? "Gen 0 Theory Unlocker" : "Gen 0 Theory Unlockers"}.`} />
                <Label text={'Max supply of Gen 0 Bronze reached. You can no longer mint them for now.'} />
              <Label text={`You have ${ownerSupplyGen1.toNumber()} out of 300 Bronze Gen 1 Theory Unlockers. There have been ${totalMinted.toNumber()} minted so far and the supply is now ${supply.toNumber()}.`} />
              <Label text={'Minting has been temporarily disabled.'} />
            </StyledCardHeader>
            {/*<StyledCardActions>*/}
            {/*  {approveStatus !== ApprovalState.APPROVED ? (*/}
            {/*    <Button*/}
            {/*      disabled={approveStatus !== ApprovalState.NOT_APPROVED}*/}
            {/*      variant="contained"*/}
            {/*      color="primary"*/}
            {/*      style={{ marginTop: '20px' }}*/}
            {/*      onClick={approve}*/}
            {/*    >*/}
            {/*      Approve DAI*/}
            {/*    </Button>*/}
            {/*  ) : (*/}
            {/*    <>*/}
            {/*      <IconButton onClick={onPresentDeposit}>*/}
            {/*        <AddIcon />*/}
            {/*      </IconButton>*/}
            {/*    </>*/}
            {/*  )}*/}
            {/*</StyledCardActions>*/}
          </StyledCardContentInner>
        </CardContent>
      </Card>
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

export default Mint;