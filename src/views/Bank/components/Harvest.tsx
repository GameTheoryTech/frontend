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
import useTokenNoUnlockBeforeTransfer from "../../../hooks/useTokenNoUnlockBeforeTransfer";
import useSetTokenNoUnlockBeforeTransfer from "../../../hooks/useTokenSetNoUnlockBeforeTransfer";
import useTombFinance from "../../../hooks/useTombFinance";

interface HarvestProps {
  bank: Bank;
  rewardsLocked : number;
  classname: string;
}

const Harvest: React.FC<HarvestProps> = ({ bank, rewardsLocked, classname }) => {
  const tombFinance = useTombFinance();
  const noUnlock = useTokenNoUnlockBeforeTransfer(tombFinance?.TSHARE);
  const { onSetTokenNoUnlockBeforeTransfer } = useSetTokenNoUnlockBeforeTransfer(tombFinance?.TSHARE);
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

  const numberWithCommas = (x: string) => {
    if(x === null) return x;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
            ${numberWithCommas(earnedInDollars || '0.00')}
        </Typography>
        <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
            Total Earned
        </Typography>

        <Typography variant="h4">
          <Value value={`${(Number(getDisplayBalance(earnings)) * (100.0-rewardsLocked) / 100.0).toFixed(4)}`} />
        </Typography>
        <Typography variant="h4" component="p" color="var(--extra-color-2)">
          ${numberWithCommas((Number(earnedInDollars) * (100.0-rewardsLocked) / 100.0).toFixed(2) || '0.00')}
        </Typography>
        <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
          {tokenName} Earned
        </Typography>

        <Typography variant="h4">
            <Value value={`${(Number(getDisplayBalance(earnings)) * rewardsLocked / 100.0).toFixed(4)}`} />
        </Typography>
        <Typography variant="h4" component="p" color="var(--extra-color-2)">
            ${numberWithCommas((Number(earnedInDollars) * rewardsLocked / 100.0).toFixed(2) || '0.00')}
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
