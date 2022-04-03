import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@mui/material';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
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
    <Modal>
      <ModalTitle text={`Select the ID of the token you wish to merge with.`} />
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
