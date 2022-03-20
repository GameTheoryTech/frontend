import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@mui/styles';

import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';

import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../tomb-finance';
import useTombFinance from '../../hooks/useTombFinance';
import { Alert } from '@mui/lab';
const useStyles = makeStyles((theme : any) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

//TODO: Get deposit fee from contract?
const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const classes = useStyles();
  const { bankId } = useParams();
  const bank = useBank(bankId);

  const { account } = useWallet();
  const { onRedeem } = useRedeem(bank);
  const statsOnPool = useStatsForPool(bank);
  return account && bank ? (
    <>
      <PageHeader
        icon="🏦"
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      <Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
        {bank.earnTokenName == "GAME" ? "There is a 1% deposit fee for genesis pools to kickstart the theory and grow the treasury." : "The withdraw fee changes the longer you are in the farm. The fees are as follows: 1 block = 25%, less than 1 hour = 8%, less than 1 day = 4%, less than 3 days = 2%, less than 5 days = 1%, less than 2 weeks = 0.5%, less than 4 weeks = 0.25%, equal to or more than 4 weeks = 0.01%."}
      </Alert>
      <Alert variant="filled" severity="warning" style={{ marginBottom: '50px' }}>
        {bank.earnTokenName == "GAME" ? "Due to the price fluctuations of low liquidity, APRs should be only thought of as relative to other pools in the protocol and not as monetary gain. Rewards are not locked for genesis pools so you can immediately start using your GAME." : "The amount of rewards created and locked decreases every week. View the docs for more info."}
      </Alert>
      <Box>
        <Grid container justifyContent="center" spacing={3} style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center', boxShadow: 'none !important' }}>
                <Typography>APR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.yearlyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>DPR</Typography>
                <Typography>{bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>TVL</Typography>
                <Typography>${statsOnPool?.TVL}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography>{bank.earnTokenName == "GAME" ? "Deposit" : "Withdraw"} Fee</Typography>
                <Typography>{statsOnPool?.fee}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2} lg={2} className={classes.gridItem}>
            <Card className={classes.gridItem}>
              <CardContent style={{textAlign: 'center'}}>
                <Typography>Rewards Locked</Typography>
                <Typography>{statsOnPool?.locked}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mt={5}>
        <StyledBank>
          <StyledCardsWrapper>
            <StyledCardWrapper>
              <Harvest bank={bank} />
            </StyledCardWrapper>
            <Spacer />
            <StyledCardWrapper>{<Stake bank={bank} />}</StyledCardWrapper>
          </StyledCardsWrapper>
          <Spacer size="lg" />
          {/* {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />} */}
          <Spacer size="lg" />
          <div>
            <Button onClick={onRedeem} color="primary" variant="contained">
              Claim & Withdraw
            </Button>
          </div>
          <Spacer size="lg" />
        </StyledBank>
      </Box>
    </>
  ) : !bank ? (
    <BankNotFound />
  ) : (
    <UnlockWallet />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  const tombFinance = useTombFinance();
  const tombAddr = tombFinance.TOMB.address;
  const tshareAddr = tombFinance.TSHARE.address;

  let pairName: string;
  let uniswapUrl: string;
  if (bank.depositTokenName.includes('GAME')) {
    pairName = 'GAME-DAI pair';
    uniswapUrl = 'https://spookyswap.finance/add/FTM/' + tombAddr;
  } else {
    pairName = 'THEORY-DAI pair';
    uniswapUrl = 'https://spookyswap.finance/add/FTM/' + tshareAddr;
  }
  return (
    <Card>
      <CardContent>
        <StyledLink href={uniswapUrl} target="_blank">
          {`👻 Provide liquidity for ${pairName} now on SpookySwap 👻`}
        </StyledLink>
      </CardContent>
    </Card>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader icon="🏚" title="Not Found" subtitle="Please return to the homepage and try again later." />
    </Center>
  );
};

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
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

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Bank;
