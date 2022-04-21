import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
// import useClaimRewardTimerDungeon from '../../../hooks/dungeon/useClaimRewardTimerDungeon';
// import useClaimRewardCheck from '../../../hooks/dungeon/useClaimRewardCheck';
import ProgressCountdown from './../components/ProgressCountdown';
import useHarvestFromDungeon from '../../../hooks/useHarvestFromDungeon';
import useEarningsOnDungeon from '../../../hooks/useEarningsOnDungeon';
import useTombStats from '../../../hooks/useTombStats';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useSetTokenNoUnlockBeforeTransfer from "../../../hooks/useTokenSetNoUnlockBeforeTransfer";
import useTombFinance from "../../../hooks/useTombFinance";
import useTokenNoUnlockBeforeTransfer from "../../../hooks/useTokenNoUnlockBeforeTransfer";

export interface HarvestProps
{
  rewardsLocked : number
  classname: string
}

const Harvest: React.FC<HarvestProps> = ({rewardsLocked, classname}) => {
  const tombStats = useTombStats();
  const tombFinance = useTombFinance();
  const { onReward } = useHarvestFromDungeon();
  const earnings = useEarningsOnDungeon();
  //const canClaimReward = useClaimRewardCheck();
  const noUnlock = useTokenNoUnlockBeforeTransfer(tombFinance?.TOMB);
  const { onSetTokenNoUnlockBeforeTransfer } = useSetTokenNoUnlockBeforeTransfer(tombFinance?.TOMB);

  const tokenPriceInDollars = useMemo(
      () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
      [tombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  //const { from, to } = useClaimRewardTimerDungeon();

  classname = classname || '';

  return (
      <>
        <Card className={classname}>
          <CardContent>
            <Box style={{marginBottom: '20px'}}>
              <CardIcon>
                <TokenSymbol symbol="TOMB" />
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
              GAME Earned
            </Typography>

            <Typography variant="h4">
              <Value value={`${(Number(getDisplayBalance(earnings)) * rewardsLocked / 100.0).toFixed(4)}`} />
            </Typography>
            <Typography variant="h4" component="p" color="var(--extra-color-2)">
              ${(Number(earnedInDollars) * rewardsLocked / 100.0).toFixed(2)}
            </Typography>
            <Typography variant="body1" component="p" className="textGlow" style={{marginBottom: '20px'}}>
              LGAME Earned
            </Typography>
            <Box className="buttonWrap">
              {!noUnlock ? (<Button
                  onClick={onSetTokenNoUnlockBeforeTransfer}
                  variant="contained"
              >
                Approve Unlock On Claim
              </Button>) : (<Button
                  onClick={onReward}
                  variant="contained"
                  disabled={earnings.eq(0)}
              >
                Claim Rewards
              </Button>)}
            </Box>
          </CardContent>
        </Card>
        {/*<Box mt={2} style={{ color: '#FFF' }}>*/}
        {/*  {canClaimReward ? (*/}
        {/*      ''*/}
        {/*  ) : (*/}
        {/*      <Card>*/}
        {/*        <CardContent>*/}
        {/*          <Typography style={{ textAlign: 'center' }}>Claim possible in</Typography>*/}
        {/*          <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*  )}*/}
        {/*</Box>*/}
      </>
  );
};

export default Harvest;