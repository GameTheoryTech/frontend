import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from '../../../components/TokenInput';

import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  decimals: number;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, decimals, onConfirm, onDismiss, tokenName = '' }) => {
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

  return (
    <Modal text={`Deposit ${tokenName} Tokens`} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        {/* <Button color="secondary" variant="outlined" onClick={onDismiss}>Cancel</Button> */}
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Deposit
        </Button>
      </ModalActions>
      <Typography variant="body2" align="center" className="textGlow" style={{marginTop: '40px'}}>
        Your rewards will be claimed whenever you deposit or withdraw tokens from the pool
      </Typography>
    </Modal>
  );
};

export default DepositModal;
