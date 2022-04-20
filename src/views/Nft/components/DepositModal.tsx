import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from './TokenInput';

import useTombFinance from '../../../hooks/useTombFinance';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';

import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  name: string;
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
  minValue?: number;
  maxValue?: number;
}

const DepositModal: React.FC<DepositModalProps> = ({ name, max, onConfirm, onDismiss, tokenName = '', minValue, maxValue }) => {
  let [val, setVal] = useState('');

  const tombFinance = useTombFinance();
  const balance = useTokenBalance(tombFinance.FTM);
  const ftmBalance = getDisplayBalance(balance);

  const fullBalance = max.toNumber().toString();

  const minLevel = minValue;
  const maxLevel = maxValue;

  let currentMaxLevel = max.toNumber();

  const handleChange = useCallback(
    (event: Event, value: number | Array<number>, activeThumb: number) => {
      setVal( value.toString() );
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  if(maxValue > currentMaxLevel) {
    maxValue = currentMaxLevel;
    minValue = minValue;
  } else {
    maxValue = maxValue;
    minValue = minValue;
  }

  let halfValue = (maxValue + minValue) / 2;
  halfValue = Math.round(halfValue);

  if (val === '') {
    val = halfValue.toString();
  }

  return (
    <Modal text={`Mint ${name} NFT`} onDismiss={onDismiss}>
      <Typography variant="h6" color="#fff" style={{marginBottom: '10px', textAlign: 'center'}}>
        {name} NFTs can be minted from level {minLevel} to {maxLevel}.<br />Each level costs 500 DAI.
      </Typography>
      <Typography variant="body1" className="textGlow" style={{marginBottom: '20px', textAlign: 'center'}}>
        Current Max Level {fullBalance}
      </Typography>
      <TokenInput
        value={val}
        onChange={handleChange}
        symbol={tokenName}
        minValue={minValue}
        maxValue={maxValue}
        balance={ftmBalance}
      />

      <ModalActions>
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Mint
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DepositModal;
