import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

const StyledCard = styled.div`
  background-color: rgba(25, 25, 25 , 0.9); //${(props) => props.theme.color.grey[800]};
  color: #2c2560 !important;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: fit-content;
  margin: auto;
`;

export default Card;
