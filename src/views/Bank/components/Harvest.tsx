import React, { useMemo } from 'react';

import { Button, Card, CardContent, Box, Typography } from '@mui/material';
import CardIcon from '../../../components/CardIcon';
import Value from '../../../components/Value';

import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../tomb-finance';
import useTombStats from '../../../hooks/useTombStats';
import useShareStats from '../../../hooks/usetShareStats';

interface HarvestProps {
  bank: Bank;
  rewardsLocked : number;
  classname: string;
}

const Harvest: React.FC<HarvestProps> = ({ bank, rewardsLocked, classname }) => {
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const tombStats = useTombStats();
  const tShareStats = useShareStats();

  const tokenName = bank.earnTokenName === 'THEORY' ? 'THEORY' : 'GAME';
  const tokenStats = bank.earnTokenName === 'THEORY' ? tShareStats : tombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  classname = classname || '';

  return (
    <Card className={classname}>
      <CardContent>
        <Box style={{marginBottom: '20px'}}>
          <CardIcon>
            <TokenSymbol symbol={bank.earnToken.symbol} />
          </CardIcon>
        </Box>

        <Typography variant="h4">
          <Value value={getDisplayBalance(earnings)} />
        </Typography>
        <Typography variant="h4" component="p" color="var(--extra-color-2)">
            ${earnedInDollars}
        </Typography>
        <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
            Total Earned
        </Typography>

        <Typography variant="h4">
          <Value value={`${(Number(getDisplayBalance(earnings)) * (100.0-rewardsLocked) / 100.0).toFixed(4)}`} />
        </Typography>
        <Typography variant="h4" component="p" color="var(--extra-color-2)">
          ${(Number(earnedInDollars) * (100.0-rewardsLocked) / 100.0).toFixed(2)}
        </Typography>
        <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
          {tokenName} Earned
        </Typography>

        <Typography variant="h4">
            <Value value={`${(Number(getDisplayBalance(earnings)) * rewardsLocked / 100.0).toFixed(4)}`} />
        </Typography>
        <Typography variant="h4" component="p" color="var(--extra-color-2)">
            ${(Number(earnedInDollars) * rewardsLocked / 100.0).toFixed(2)}
        </Typography>
        <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
          L{tokenName} Earned
        </Typography>

        <Box className="buttonWrap">
          <Button
            onClick={onReward}
            variant="contained"
            disabled={earnings.eq(0)}
          >
            Claim Rewards
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Harvest;
