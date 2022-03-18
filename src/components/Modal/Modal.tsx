import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import Container from '../Container';

export interface ModalProps {
  onDismiss?: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ children }, className : string = "") => {
  return (

      <StyledModal className={className}>
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </StyledModal>

  );
};

const StyledModal = styled.div`
  border-radius: 12px;
  position: relative;
`;

export default Modal;
