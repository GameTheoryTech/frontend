import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import MergeInput from './MergeInput';

interface MergeModalProps extends ModalProps {
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const MergeModal: React.FC<MergeModalProps> = ({ onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  return (
    <Modal text={`Merge NFTs`} onDismiss={onDismiss}>
      <MergeInput
        value={val}
        onChange={handleChange}
        symbol={tokenName}
      />
      <ModalActions>
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Let's Go
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default MergeModal;
