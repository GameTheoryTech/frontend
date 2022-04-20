import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import CardIcon from '../../../components/CardIcon';
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

interface MintProps {
  name: string;
  maxValue: number;
  minValue: number;
}

const Mint: React.FC<MintProps> = ({ name, minValue, maxValue }) => {
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
      name={name}
      max={maxLevel}
      onConfirm={(value) => {
        onMint(value);
        onDismissDeposit();
      }}
      tokenName={'Level'}
      minValue={minValue}
      maxValue={maxValue}
    />,
  );

  return (
    <>
      {approveStatus === ApprovalState.APPROVED ? (
        <>

          <Button variant="contained" onClick={onPresentDeposit} fullWidth style={{marginTop: '20px'}}>
            Mint
          </Button>
        </>
      ) : (
        <>
          <Button
            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
            variant="contained"
            onClick={approve}
            fullWidth
            style={{marginTop: '20px'}}
          >
            Approve DAI
          </Button>
        </>
      )}
    </>
  );
};

export default Mint;