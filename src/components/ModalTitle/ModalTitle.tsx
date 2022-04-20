import React from 'react';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalTitleProps {
  text?: string;
  icon?: string;
  onDismiss?: () => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ text, icon, onDismiss }) => {
  return (
    <StyledModalTitle>
      {icon && <Box style={{marginBottom: "20px"}}>{icon}</Box>}
      <Typography variant="h4" className="textGlow pink kallisto">{text}</Typography>
      <CloseIcon onClick={onDismiss} className="textGlow pink" style={{cursor: 'pointer', position: 'absolute', right: '20px', fontSize: '35px'}} />
    </StyledModalTitle>
  );
};

const StyledModalTitle = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export default ModalTitle;
