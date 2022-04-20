import React, { useMemo } from 'react';
import useTokenBalance from '../../hooks/useTokenBalance';
import useTokenLocked from '../../hooks/useTokenLocked';
import useGameLocked from '../../hooks/useGameLocked';
import { getDisplayBalance } from '../../utils/formatBalance';
import { Typography, Card, CardContent, Grid, Box, Button } from '@mui/material';
import CardIcon from '../../components/CardIcon';

import Modal, { ModalProps } from '../Modal';
import useTombFinance from '../../hooks/useTombFinance';
import TokenSymbol from '../TokenSymbol';
import useTokenCanUnlockAmount from "../../hooks/useTokenCanUnlockAmount";
import useUnlockGame from "../../hooks/useUnlockGame";
import useUnlockTheory from "../../hooks/useUnlockTheory";
import useFetchTheoryUnlockers from "../../hooks/useFetchTheoryUnlockers";
import {BigNumber} from "ethers";
import useFetchTheoryUnlockersGen1 from "../../hooks/useFetchTheoryUnlockersGen1";
import useLpStats from '../../hooks/useLpStats';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const tombFinance = useTombFinance();
  const tombFtmLpStats = useLpStats('GAME-DAI-LP');
  const tShareFtmLpStats = useLpStats('THEORY-DAI-LP');

  const tombBalance = useTokenBalance(tombFinance?.TOMB);
  const gameLocked = useGameLocked();
  const gameCanUnlockAmount = useTokenCanUnlockAmount(tombFinance?.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);
  const displayGameLocked = useMemo(() => getDisplayBalance(gameLocked), [gameLocked]);
  const displayGameCanUnlock = useMemo(() => getDisplayBalance(gameCanUnlockAmount), [gameCanUnlockAmount]);

  const theoryUnlockers = useFetchTheoryUnlockers();
  const theoryUnlockersGen1 = useFetchTheoryUnlockersGen1();
  const maxTheoryUnlockerGen0 = theoryUnlockers.length == 0 ? null : theoryUnlockers.reduce((prev, current) => (prev.level > current.level) ? prev : current)
  const maxTheoryUnlockerUnlockAmountGen0 = maxTheoryUnlockerGen0 ? maxTheoryUnlockerGen0.unlockAmount : BigNumber.from(0);
  const maxTheoryUnlockerGen1 = theoryUnlockersGen1.length == 0 ? null : theoryUnlockersGen1.reduce((prev, current) => (prev.level > current.level) ? prev : current)
  const maxTheoryUnlockerUnlockAmountGen1 = maxTheoryUnlockerGen1 ? maxTheoryUnlockerGen1.unlockAmount : BigNumber.from(0);
  const maxTheoryUnlockerIsGen1 = maxTheoryUnlockerUnlockAmountGen1 > maxTheoryUnlockerUnlockAmountGen0;
  const maxTheoryUnlocker = maxTheoryUnlockerIsGen1 ? maxTheoryUnlockerGen1 : maxTheoryUnlockerGen1;
  const maxTheoryUnlockerUnlockAmount = maxTheoryUnlockerIsGen1 ? maxTheoryUnlockerUnlockAmountGen1 : maxTheoryUnlockerUnlockAmountGen0;
  const tshareBalance = useTokenBalance(tombFinance?.TSHARE);
  const theoryLocked = useTokenLocked(tombFinance?.TSHARE);
  const naturalUnlockAmount = useTokenCanUnlockAmount(tombFinance?.TSHARE);
  const theoryCanUnlockAmount = maxTheoryUnlockerUnlockAmount.gt(naturalUnlockAmount) ? maxTheoryUnlockerUnlockAmount : naturalUnlockAmount;
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);
  const displayTheoryLocked = useMemo(() => getDisplayBalance(theoryLocked), [theoryLocked]);
  const displayTheoryCanUnlock = useMemo(() => getDisplayBalance(theoryCanUnlockAmount), [theoryCanUnlockAmount]);

  const tbondBalance = useTokenBalance(tombFinance?.HODL);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);

  const { onUnlockGame } = useUnlockGame();
  const { onUnlockTheory } = useUnlockTheory();

  return (
    <Modal text="My Wallet" onDismiss={onDismiss}>

      <Card className="boxed">
        <CardContent>
          <Box style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="TOMB" />
            </CardIcon>
          </Box>

          <Grid container spacing={1}>

            <Grid item xs={6}>
              <Typography variant="h4">
                {displayTombBalance}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">GAME Available</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4">
                {displayGameLocked}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">LGAME Locked</Typography>
            </Grid>

          </Grid>
          <Button variant="contained" disabled={gameCanUnlockAmount.eq(0)} onClick={onUnlockGame} style={{width: '100%', marginTop: '20px'}}>Unlock {displayGameCanUnlock} LGAME</Button> {/*Can only unlock after a year, so don't have to implement this immediately.*/}
        </CardContent>
      </Card>

      <Card className="boxed" style={{marginTop: '20px'}}>
        <CardContent>
          <Box style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="TSHARE" />
            </CardIcon>
          </Box>

          <Grid container spacing={1}>

            <Grid item xs={6}>
              <Typography variant="h4">
                {displayTshareBalance}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">THEORY Available</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4">
                {displayTheoryLocked}
              </Typography>
              <Typography variant="body1" component="p" className="textGlow">LTHEORY Locked</Typography>
            </Grid>

          </Grid>
          <Button variant="contained" disabled={theoryCanUnlockAmount.eq(0)} onClick={() => onUnlockTheory(maxTheoryUnlockerIsGen1,maxTheoryUnlocker ? maxTheoryUnlocker.token_id : BigNumber.from(0))} style={{width: '100%', marginTop: '20px'}}>Unlock {displayTheoryCanUnlock} LTHEORY</Button>
          <Typography variant="body1" className="textGlow" component="p" style={{marginTop: '20px'}}>
            LTHEORY Tokens can only be unlocked once using NFTs
          </Typography>
        </CardContent>
      </Card>

      <Card className="boxed" style={{marginTop: '20px'}}>
        <CardContent>
          <Box style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="HODL" />
            </CardIcon>
          </Box>

          <Typography variant="h4">
            {displayTbondBalance}
          </Typography>
          <Typography variant="body1" component="p" className="textGlow">HODL Available</Typography>

        </CardContent>
      </Card>

      <Card className="boxed" style={{marginTop: '20px'}}>
        <CardContent>
          <Box className="icon-pools" style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="GAME" />
            </CardIcon>
            <CardIcon>
              <TokenSymbol symbol="DAI" />
            </CardIcon>
          </Box>

          <Typography variant="h4">
            {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'}
          </Typography>
          <Typography variant="body1" component="p" className="textGlow">GAME-DAI LP Tokens Available</Typography>

        </CardContent>
      </Card>

      <Card className="boxed" style={{marginTop: '20px'}}>
        <CardContent>
          <Box className="icon-pools" style={{marginBottom: '20px'}}>
            <CardIcon>
              <TokenSymbol symbol="THEORY" />
            </CardIcon>
            <CardIcon>
              <TokenSymbol symbol="DAI" />
            </CardIcon>
          </Box>

          <Typography variant="h4">
            {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'}
          </Typography>
          <Typography variant="body1" component="p" className="textGlow">THEORY-DAI LP Tokens Available</Typography>

        </CardContent>
      </Card>


    </Modal>
  );
};

export default AccountModal;
