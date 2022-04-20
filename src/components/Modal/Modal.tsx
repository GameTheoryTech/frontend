import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import ModalTitle from '../ModalTitle';

export interface ModalProps {
  onDismiss?: () => void;
  className?: string;
  text?: string;
  icon?: string;
}

const Modal: React.FC<ModalProps> = ({ children, onDismiss, text, icon }, className : string = "") => {
  return (

      <StyledModal className={className}>
        <Card>
          <ModalTitle text={text} icon={icon} onDismiss={onDismiss} />
          <CardContent>{children}</CardContent>
        </Card>
      </StyledModal>

  );
};

const StyledModal = styled.div`
  position: relative;
  height:100%;
  text-align: center;
`;

export default Modal;
