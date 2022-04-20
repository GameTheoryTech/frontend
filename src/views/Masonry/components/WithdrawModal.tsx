import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from '../../../components/TokenInput';

import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface WithdrawModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
  withdrawPercentage?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', withdrawPercentage }) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  withdrawPercentage = withdrawPercentage || 0;

  return (
    <Modal text={`Withdraw ${tokenName}`} onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      <Typography variant="h6" component="p" style={{marginTop: '20px'}} align="center">
        Current Withdrawal Fee: {withdrawPercentage}%              
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Confirm
        </Button>
        {/* <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button text="Confirm" onClick={() => onConfirm(val)} /> */}
      </ModalActions>
    </Modal>
  );
};

export default WithdrawModal;
