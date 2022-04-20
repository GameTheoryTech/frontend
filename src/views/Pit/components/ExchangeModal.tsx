import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from '../../../components/TokenInput';
import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import Label from '../../../components/Label';

interface ExchangeModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  title: string;
  description: string;
  action: string;
  tokenName: string;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  max,
  title,
  description,
  onConfirm,
  onDismiss,
  action,
  tokenName,
}) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => getFullDisplayBalance(max), [max]);

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => setVal(e.currentTarget.value), [setVal]);

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal text={title} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <Label text={description} />
      <ModalActions>
        <Button variant="contained" onClick={onDismiss}>Cancel</Button>
        <Button variant='contained' onClick={() => onConfirm(val)}>{action}</Button>
      </ModalActions>
    </Modal>
  );
};

export default ExchangeModal;
