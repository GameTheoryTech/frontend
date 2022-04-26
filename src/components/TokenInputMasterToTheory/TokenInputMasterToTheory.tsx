import React from 'react';
import styled from 'styled-components';

import { Button, Typography } from '@mui/material';
import Input, { InputProps } from '../Input';

interface TokenInputProps extends InputProps {
  max: number | string;
  symbol: string;
  onSelectMax?: () => void;
  price: number
}

const TokenInputMasterToTheory: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value, price }) => {
    return (
    <StyledTokenInput>
      <StyledMaxText>
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
      <Typography variant="h5" style={{textAlign: 'center', marginTop: '20px', marginBottom: '10px'}}>
        Estimated THEORY tokens
      </Typography>
      <Typography variant="h3" color="var(--extra-color-2)" align='center'>
        {isNaN(+value) ? 0 : (+value*price).toFixed(4)}
      </Typography>
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

export default TokenInputMasterToTheory;
