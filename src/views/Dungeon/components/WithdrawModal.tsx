import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

import {getDisplayBalance, getFullDisplayBalance} from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import TokenInputMasterToTheory from "../../../components/TokenInputMasterToTheory";
import usePriceOfMasterInTheory from "../../../hooks/usePriceOfMasterInTheory";

interface WithdrawModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
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

  const price = Number(getDisplayBalance(usePriceOfMasterInTheory()));

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInputMasterToTheory
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        price={price}
      />
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
