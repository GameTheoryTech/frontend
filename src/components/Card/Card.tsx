import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
  background-color: #212E4D;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-width: 500px;
  max-width: 500px;
  margin: auto;
  border-radius: 20px;
  position: relative;
  transform: translateY(-50%);
  top: 50%;
  max-height: 100%;
  @media (max-width: 500px) {
    min-width: 100vw;
  }
`;

export default Card;
