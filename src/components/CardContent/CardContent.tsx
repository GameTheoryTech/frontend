import React from 'react';
import styled from 'styled-components';

const CardContent: React.FC = ({ children }) => <StyledCardContent>{children}</StyledCardContent>;

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 30px 20px;
  padding-top: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  strong {
    color: var(--extra-color-1);
    text-Shadow: 0px 0px 20px var(--extra-color-1);
  }
`;

export default CardContent;
