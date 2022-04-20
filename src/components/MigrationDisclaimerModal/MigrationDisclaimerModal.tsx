import React, { useCallback } from 'react';

import { Button } from '@mui/material';
import Modal, { ModalProps } from '..//Modal';
import ModalActions from '..//ModalActions';
import styled from 'styled-components';

interface MigrationDisclaimerModalProps extends ModalProps {
  onConfirm: () => void;
  onDismiss: () => void;
}

const MigrationDisclaimerModal: React.FC<MigrationDisclaimerModalProps> = ({ onConfirm, onDismiss }) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    // onDismiss();
  }, [onConfirm, onDismiss]);
  const handleDismiss = useCallback(() => onDismiss(), [onDismiss]);

  return (
    <Modal text={`Migration Disclaimer`} onDismiss={onDismiss}>
      <div>
        <StyledText>
          Due to the upgrade, all Masonry functionalities other than [Settle and withdraw] has been disabled for users
          who staked in legacy Masonry. Please withdraw all balances from the previous masonry after the update.
        </StyledText>
      </div>
      <ModalActions>
        <Button variant="contained" onClick={handleDismiss}>Cancel</Button>
        <Button variant='contained' onClick={handleConfirm}>I understand</Button>
      </ModalActions>
    </Modal>
  );
};

const StyledText = styled.p`
  color: ${(props) => props.theme.color.grey[300]};
`;

export default MigrationDisclaimerModal;
