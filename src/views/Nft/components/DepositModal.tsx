import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@mui/material';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from './TokenInput';

import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');

  const fullBalance = max.toNumber().toString();

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
    <Modal>
      <ModalTitle text={`Buy levels using DAI. Each level costs 500 DAI.`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
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
