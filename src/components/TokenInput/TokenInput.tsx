import React from 'react';
import styled from 'styled-components';

import { Button } from '@mui/material';
import Input, { InputProps } from '../Input';

interface TokenInputProps extends InputProps {
  max: number | string;
  symbol: string;
  onSelectMax?: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  return (
    <StyledTokenInput>
      <StyledMaxText className="textGlow">
        {max.toLocaleString()} {symbol} Available
      </StyledMaxText>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            {/* <StyledTokenSymbol>{symbol}</StyledTokenSymbol> */}
            <Button style={styleButton} size="small" color="primary" variant="contained" onClick={onSelectMax}>
              Max
            </Button>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
    </StyledTokenInput>
  );
};

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledTokenInput = styled.div``;

const StyledTokenAdornmentWrapper = styled.div``;

const StyledMaxText = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 44px;
  justify-content: center;
`;

const styleButton = {
  height: '56px',
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0'
};

export default TokenInput;
