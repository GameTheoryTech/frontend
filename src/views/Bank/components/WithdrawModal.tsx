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
  decimals?: number;
  withdrawPercentage?: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', decimals = 18, withdrawPercentage }) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals, false);
  }, [max, decimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  withdrawPercentage = withdrawPercentage || '';

  return (
    <Modal text={`Withdraw ${tokenName} Tokens`} onDismiss={onDismiss}>
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
          Withdraw
        </Button>
      </ModalActions>

      <Typography variant="body2" align="center" className="textGlow" style={{marginTop: '40px'}}>
        Your rewards will be claimed whenever you deposit or withdraw tokens from the pool
      </Typography>
    </Modal>
  );
};

export default WithdrawModal;
