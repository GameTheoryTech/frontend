import React from 'react';
import styled from 'styled-components';

import { Box, Button, Typography } from '@mui/material';
import Input, { InputProps } from '../../../components/Input';

interface MergeInputProps extends InputProps {
    symbol: string;
    onSelectMax?: () => void;
}

const MergeInput: React.FC<MergeInputProps> = ({ onChange, value, symbol }) => {
    return (
        <Box textAlign="center">
            <Typography variant="body2" style={{marginBottom: '20px'}}>Select the ID Number of the NFT you wish to merge with.</Typography>
            <Typography variant="body1" className="textGlow" style={{marginBottom: '20px'}}>
                Note that the color of the new NFT will be based on the one you clicked merged on.
            </Typography>
            {
                symbol == "TUG1" ? <StyledMaxText>
                    Gen 1 NFTs can only be merged once.
                </StyledMaxText> : ""
            }
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
            <Typography variant="body1" className="textGlow" style={{marginTop: '20px'}}>
                The combined level of the two NFTs cannot exceed the current max level.
            </Typography>
        </Box>
    );
};

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

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