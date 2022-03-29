import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import Mint from './components/Mint';
import { makeStyles } from '@mui/styles';

import { Box, Card, CardContent, Button, Typography, Grid } from '@mui/material';

import { Alert } from '@mui/lab';
import ReactPlayer from 'react-player';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import { createGlobalStyle } from 'styled-components';
import axios from "axios";
import useFetchTheoryUnlockers from "../../hooks/useFetchTheoryUnlockers";
import Label from "../../components/Label";
import useTokenCanUnlockAmount from "../../hooks/useTokenCanUnlockAmount";
import {getDisplayBalance} from "../../utils/formatBalance";
import useUnlockTheory from "../../hooks/useUnlockTheory";
import useUnlockTheoryWithNFT from "../../hooks/useUnlockTheoryWithNFT";
import useMaxLevel from "../../hooks/useMaxLevel";
import useLevelUpTheoryUnlocker from "../../hooks/useLevelUpTheoryUnlocker";

// const BackgroundImage = createGlobalStyle`
//   body, html {
//     background: url(${MasonryImage}) no-repeat !important;
//     background-size: cover !important;
//   }
// `;

const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
}

* {
    border-radius: 0 !important;
    box-shadow: none !important;
}
`;

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Nft = () => {
  const classes = useStyles();
  const { account } = useWallet();
  const theoryUnlockers = useFetchTheoryUnlockers();
  const { onUnlockTheory } = useUnlockTheoryWithNFT();
  const { onLevelUp } = useLevelUpTheoryUnlocker();
  const maxLevel = useMaxLevel();

  return (
    <Page>
      <BackgroundImage />
      {!!account ? (
        <>
          <Alert variant="filled" severity="info" style={{ marginTop: '50px' }}>
            You can view, mint, and merge your NFTs, as well as unlock LTHEORY using your NFTs, here.
          </Alert>
          <Alert variant="filled" severity="info" style={{ marginTop: '50px' }}>
            Every 15 days starting on {(new Date('2022-03-28T12:00:00Z')).toString()}, 5 more levels will be unlocked until max level 50.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginTop: '50px' }}>
            Your NFT will stay the color it was when you minted it. Certain colors will get certain perks, but you will not be limited in your unlock potential by choosing a lesser color.
            Merging two NFTs will create an NFT that has the color of the FIRST NFT you selected.
            The colors of the NFTs are as follows: Level 1-19 = Bronze, Level 20-39: Silver, Level 40-49: Gold, Level 50: Platinum. Check the docs for the images.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginTop: '50px' }}>
            Each level costs 500 DAI. This means that: Level 1 = 500 DAI, Level 5 = 2,500 DAI, Level 10 = 5000 DAI, Level 15 = 7500 DAI, Level 20 = 10,000 DAI,
            Level 25 =12,500 DAI, Level 30 = 15,000 DAI, Level 35 = 17,500 DAI, Level 40 = 20,000 DAI, Level 45 = 22,500 DAI,
            Level 50 = 25,000 DAI.
          </Alert>
          <Alert variant="filled" severity="warning" style={{ marginTop: '50px' }}>
            You can only unlock NEWLY locked rewards. Each level of NFT unlocks 1% of your newly locked rewards. Once you use ANY NFT to unlock, you can no longer unlock those rewards with an NFT of the same type. Use the Unlock button in My Wallet to automatically choose the best NFT to use.
          </Alert>
          <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
            NFTs
          </Typography>

            <Box mt={4}>
              <StyledCardWrapper>
                <Mint />
              </StyledCardWrapper>
            </Box>
          {
            theoryUnlockers.map((item, index)=>{
              let time = item.timeLeftToLevel.toNumber();
              let days        = Math.floor(time/24/60/60);
              let hoursLeft   = Math.floor((time) - (days*86400));
              let hours       = Math.floor(hoursLeft/3600);
              let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
              let minutes     = Math.ceil(minutesLeft/60);
              if(minutes === 0) minutes = 1; //Never show 0 minutes.
              //let seconds     = time % 60;

              return (<Box key={index} mt={4}>
            <StyledCardWrapper>
              <Box>
                <Card>
                  <CardContent>
                    <StyledCardContentInner>
                      <Label text={`Theory Unlocker #${item.token_id} (${item.attributes[0].value} Level ${item.level})`} />
                      <StyledActionSpacer/>
                      <ReactPlayer url={item.animation_url} controls={false} muted={true} playing={true} loop={true} />
                      <StyledActionSpacer/>
                      <Button color="primary" variant="contained" disabled={item.unlockAmount.eq(0)} onClick={()=>onUnlockTheory(item.token_id)} >{`Unlock ${getDisplayBalance(item.unlockAmount)} LTHEORY Using This NFT`}</Button>
                      <StyledActionSpacer/>
                      <Button color="primary" variant="contained" disabled={!item.timeLeftToLevel.eq(0) || item.level.gte(maxLevel)} onClick={()=>onLevelUp(item.token_id)} >{
                        item.level.eq(maxLevel) ? ("Current max level reached") :
                        (item.timeLeftToLevel.eq(0) ? `Level Up to Level ${item.level.add(1).toNumber()}` : `${days.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})}:${hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})}:${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})} (D:H:M) left until next level up`)}</Button>
                      <StyledActionSpacer/>
                      <Button color="primary" variant="contained" disabled={true} >{`Merge Functionality on the Website Coming Soon`}</Button>
                    </StyledCardContentInner>
                  </CardContent>
                </Card>
              </Box>
            </StyledCardWrapper>
            </Box>);})
          }
        </>
      ) : (
        <UnlockWallet />
      )}
    </Page>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

export default Nft;
