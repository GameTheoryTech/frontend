import React from 'react';
import styled from 'styled-components';

import { Button } from '@mui/material';
import Input, { InputProps } from '../../../components/Input';

interface MergeInputProps extends InputProps {
    symbol: string;
    onSelectMax?: () => void;
}

const MergeInput: React.FC<MergeInputProps> = ({ onChange, value }) => {
    return (
        <StyledMergeInput>
            <StyledMaxText>
                Note that the color of the token will be of the token you clicked the merge button on first.
            </StyledMaxText>
            <StyledMaxText>
                The combined level of the two NFTs cannot exceed the current max level.
            </StyledMaxText>
            <Input
                // endAdornment={
                //     <StyledTokenAdornmentWrapper>
                //         {/* <StyledTokenSymbol>{symbol}</StyledTokenSymbol> */}
                //         <StyledSpacer />
                //         <div>
                //             <Button size="small" color="primary" variant="contained" onClick={onSelectMax}>
                //                 Max
                //             </Button>
                //         </div>
                //     </StyledTokenAdornmentWrapper>
                // }
                onChange={onChange}
                placeholder="0"
                value={value}
            />
        </StyledMergeInput>
    );
};

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledMergeInput = styled.div``;

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`;

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`;

export default MergeInput;