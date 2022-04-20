import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import ExchangeCard from './components/ExchangeCard';
import useBondStats from '../../hooks/useBondStats';
import useTombFinance from '../../hooks/useTombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../tomb-finance/constants';
import { Typography, Grid } from '@mui/material';
import useRefresh from "../../hooks/useRefresh";
import useTreasury from "../../hooks/useTreasury";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: '100px 0',
    '@media (max-width: 767px)': {
      padding: '40px 0'
    }
  },
  boxClear: {
    border: 'none',
    boxShadow: 'none',
    '& > *': {
      padding: '0',
      '&:last-child': {
        paddingBottom: '0'
      }
    },
  },
}));

const Pit: React.FC = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const tombFinance = useTombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bondsPurchasable = useBondsPurchasable();
  const rebateStats = useTreasury();
  const  { slowRefresh } = useRefresh();

  const bondBalance = useTokenBalance(tombFinance?.HODL);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance?.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} HODL with ${amount} TOMB`,
      });
    },
    [tombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await tombFinance?.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} HODL` });
    },
    [tombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice, slowRefresh]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat, slowRefresh]);

  const hodlPrice = getDisplayBalance(bondBalance) + ' HODL';

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <div className={classes.section}>
            <Typography align="center" variant="h2" component="h1" className="textGlow pink" style={{marginBottom: '20px'}}>
              HODL (Bonds)
            </Typography>
            <Route exact path={path}>
              <Typography align="center" variant="h5" component="p" style={{marginBottom: '50px', fontWeight: '500'}}>
                Earn premiums upon redemption
              </Typography>
            </Route>

            <Grid container justifyContent="center" spacing={3} style={{marginBottom: '20px'}}>

              <Grid item xs={6} md={4} style={{textAlign: 'center'}}>
                <Typography variant="body1" component="p" className="textGlow">Game Price (TWAP)</Typography>
                  <Typography variant="h4" style={{marginBottom: '20px'}}>
                    {getDisplayBalance(cashPrice, 18, 4)} DAI
                  </Typography>
                </Grid>

                <Grid item xs={6} md={4} style={{textAlign: 'center'}}>
                  <Typography variant="body1" component="p" className="textGlow">HODL Price (Inc Premium)</Typography>
                  <Typography variant="h4" style={{marginBottom: '20px'}}>
                    {Number(bondStat?.tokenInFtm).toFixed(2) || '-'} DAI
                  </Typography>
                </Grid>

            </Grid>


            <Grid container justifyContent="center" spacing={3} style={{marginBottom: '50px'}}>

              <Grid item xs={12} md={4} style={{textAlign: 'center'}}>

                <ExchangeCard
                  action="Purchase"
                  fromToken={tombFinance?.TOMB}
                  fromTokenName="GAME"
                  toToken={tombFinance?.HODL}
                  toTokenName="HODL"
                  priceDesc={
                    !isBondPurchasable
                      ? 'GAME is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 4)
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />

              </Grid>

              <Grid item xs={12} md={4} style={{textAlign: 'center'}}>

                <ExchangeCard
                  action="Redeem"
                  fromToken={tombFinance?.HODL}
                  fromTokenName="HODL"
                  toToken={tombFinance?.TOMB}
                  toTokenName="GAME"
                  priceDesc={hodlPrice}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || rebateStats.maxBondSellBN.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when GAME > ${BOND_REDEEM_PRICE} DAI` : null}
                  max={rebateStats.maxBondSellBN}
                />
                  
              </Grid>
              
            </Grid>
            </div>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

export default Pit;
