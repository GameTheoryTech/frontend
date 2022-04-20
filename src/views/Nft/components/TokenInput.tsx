import React from 'react';
import styled from 'styled-components';

import { Slider, Button, Typography } from '@mui/material';
import Input, { InputProps } from '../../../components/Input';

interface TokenInputProps {
    max?: number;
    symbol: string;
    onSelectMax?: () => void;
    onChange?: (event: Event, value: number | Array<number>, activeThumb: number) => void;
    value: string;
    minValue?: number;
    maxValue?: number;
    balance: string;
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value, minValue, maxValue, balance }) => {

    return (
        <StyledTokenInput>
            <Slider
                defaultValue={Number(value)}
                aria-label="Default"
                valueLabelDisplay="on"
                step={1}
                min={minValue}
                max={maxValue}
                onChange={onChange}
                style={{ display: 'block', width: '90%', margin: '0 auto', padding: '20px 0' }}
            />
            {/*<Input
                endAdornment={ 
                    <StyledTokenAdornmentWrapper>
                        <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
                        <div>
                            <Button size="small" style={styleButton} color="primary" variant="contained" onClick={onSelectMax}>
                                Max
                            </Button>
                        </div>
                    </StyledTokenAdornmentWrapper>
                
                onChange={onChange}
                placeholder="0"
                value={value}
            />*/}
            <Typography variant="h5" style={{textAlign: 'center', marginTop: '20px', marginBottom: '10px'}}>
                NFT Price
            </Typography>
            <Typography variant="h3" color="var(--extra-color-2)" align='center'>{Number(value)*500} DAI</Typography>
            <StyledMaxText className="textGlow">
                {balance.toLocaleString()} DAI Available
            </StyledMaxText>
        </StyledTokenInput>
    );
};

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledTokenInput = styled.div``;

const StyledMaxText = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 44px;
  justify-content: center;
`;

export default TokenInput;