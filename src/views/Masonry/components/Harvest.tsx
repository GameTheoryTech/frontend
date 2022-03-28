import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerMasonry from '../../../hooks/masonry/useClaimRewardTimerMasonry';
import useClaimRewardCheck from '../../../hooks/masonry/useClaimRewardCheck';
import ProgressCountdown from './../components/ProgressCountdown';
import useHarvestFromMasonry from '../../../hooks/useHarvestFromMasonry';
import useEarningsOnMasonry from '../../../hooks/useEarningsOnMasonry';
import useTombStats from '../../../hooks/useTombStats';
import { getDisplayBalance } from '../../../utils/formatBalance';

export interface HarvestProps
{
  rewardsLocked : number
}

const Harvest: React.FC<HarvestProps> = ({rewardsLocked}) => {
  const tombStats = useTombStats();
  const { onReward } = useHarvestFromMasonry();
  const earnings = useEarningsOnMasonry();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const { from, to } = useClaimRewardTimerMasonry();


  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="TOMB" />
              </CardIcon>
              <Value value={getDisplayBalance(earnings)} />
              <Label text={`≈ $${earnedInDollars}`} color="#89cff0" />
              <Label text="Total Earned" />
              <br/>
              <Value value={`${(Number(getDisplayBalance(earnings)) * (100.0-rewardsLocked) / 100.0).toFixed(4)}`} />
              <Label text={`≈ $${(Number(earnedInDollars) * (100.0-rewardsLocked) / 100.0).toFixed(2)}`} color="#89cff0" />
              <Label text="GAME Earned" />
              <br/>
              <Value value={`${(Number(getDisplayBalance(earnings)) * rewardsLocked / 100.0).toFixed(4)}`} />
              <Label text={`≈ $${(Number(earnedInDollars) * rewardsLocked / 100.0).toFixed(2)}`} color="#89cff0" />
              <Label text="LGAME Earned" />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                onClick={onReward}
                color="primary"
                variant="contained"
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      <Box mt={2} style={{ color: '#FFF' }}>
        {canClaimReward ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{ textAlign: 'center' }}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
