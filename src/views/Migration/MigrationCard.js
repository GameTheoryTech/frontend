import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import {Box, Card, CardContent, Typography, Grid, Button} from '@mui/material';

import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
import useStatsForPool from '../../hooks/useStatsForPool';

import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import { getDisplayBalance } from '../../utils/formatBalance';

import useTombStats from '../../hooks/useTombStats';
import useShareStats from '../../hooks/usetShareStats';
import useEarnings from '../../hooks/useEarnings';

import { makeStyles } from '@mui/styles';
import useModal from "../../hooks/useModal";
import DepositModal from "../Bank/components/DepositModal";
import useTokenBalance from "../../hooks/useTokenBalance";
import ERC20 from "../../tomb-finance/ERC20";
import { getDefaultProvider } from '../../utils/provider';
import useApprove, {ApprovalState} from "../../hooks/useApprove";
import useTombFinance from "../../hooks/useTombFinance";
import {useHasPendingApproval, useTransactionAdder} from "../../state/transactions/hooks";
import useAllowance from "../../hooks/useAllowance";
import useRefresh from "../../hooks/useRefresh";
import {BigNumber} from "ethers";
import config from "../../config";
import axios from "axios";
import {decimalToBalance} from "../../tomb-finance/ether-utils";
import useHandleTransactionReceipt from "../../hooks/useHandleTransactionReceipt";

const useStyles = makeStyles((theme) => ({
  blueGlow: {
    color: 'var(--extra-color-1)',
    textShadow: '0px 0px 20px var(--extra-color-1)'
  },
}));

function useMigrationBalance(tombFinance, token) {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const isUnlocked = tombFinance?.isUnlocked;

    const fetchBalance = useCallback(async () => {
        setBalance(await tombFinance?.contracts.Migrator.balanceOf(tombFinance?.myAccount, token.address));
    }, [tombFinance?.myAccount, token.address]);

    useEffect(() => {
        if (isUnlocked) {
            fetchBalance().catch((err) => console.error(`Failed to fetch migration balance: ${err.stack}`));
            let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
            return () => clearInterval(refreshInterval);
        }
    }, [isUnlocked, fetchBalance, tombFinance]);

    return balance;
}

function useMaxMigration(tombFinance, token) {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const isUnlocked = tombFinance?.isUnlocked;

    const fetchBalance = useCallback(async () => {
        const res = await axios.post('https://migration.gametheory.tech/.netlify/functions/server/maxBN', { address: tombFinance?.myAccount, token: token.address });
        if(res.data.amount !== "error") setBalance(BigNumber.from(res.data.amount));
    }, [tombFinance?.myAccount, token.address]);

    useEffect(() => {
        if (isUnlocked) {
            fetchBalance().catch((err) => console.error(`Failed to fetch max migration: ${err.stack}`));
            let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
            return () => clearInterval(refreshInterval);
        }
    }, [isUnlocked, fetchBalance, tombFinance]);

    return balance;
}

const useStake = () => {
    const handleTransactionReceipt = useHandleTransactionReceipt();

    const handleStake = useCallback(
        (tombFinance, token, amount) => {
            // noinspection JSCheckFunctionSignatures
            handleTransactionReceipt(
                tombFinance.migrate(token.address, amount), `Transfer ${amount} ${token.name} for migration`);
        },
        [handleTransactionReceipt],
    );
    return { onStake: handleStake };
};

const MigrationCard = ({ token, classname }) => {
  const classes = useStyles();
  classname = classname || '';
    const tombFinance = useTombFinance();
    const [contract, setContract] = useState(new ERC20(token.address, getDefaultProvider(), token.name, 18));
    const tokenBalance = useTokenBalance(contract);
    const migrationBalance = useMigrationBalance(tombFinance, token);
    const maxMigration = useMaxMigration(tombFinance, token);
    const maxMigrationReduced = maxMigration.sub(migrationBalance);
    const maxBalance = tokenBalance.lt(maxMigrationReduced) ? tokenBalance : maxMigrationReduced;
    const [signed, setSigned] = useState(false);
    const {onStake} = useStake();
    if(tombFinance?.signer && !signed)
    {
        contract.connect(tombFinance?.signer);
        setSigned(true);
    }
    const [approveStatus, approve] = useApprove(contract, tombFinance?.contracts.Migrator.address);
    const [onPresentDeposit, onDismissDeposit] = useModal(
        <DepositModal
            max={maxBalance}
            decimals={18}
            onConfirm={(amount) => {
                if (Number(amount) <= 0 || isNaN(Number(amount))) return;
                onStake(tombFinance, token, amount);
                onDismissDeposit();
            }}
            tokenName={token.name}
            description={"Make sure you want to migrate these tokens, as this action is irreversible."}
        />,
    );

  return (
    <Grid item xs={12} md={4}>
      <Card className={classname}>
        <CardContent align="center">
            <Box className="icon-pools" style={{marginBottom: '20px'}}>
              <CardIcon>
                <TokenSymbol symbol={token.name} />
              </CardIcon>
              {

                !token.name.endsWith("-DAI") ? null : (<CardIcon>
                  <TokenSymbol symbol="DAI"/>
                </CardIcon>)
              }
            </Box>
            <Typography variant="h4" className="kallisto" style={{marginBottom: '20px'}}>
              {token.name}
            </Typography>
            <Typography variant="body1" style={{marginBottom: '20px'}}>
              Irreversibly deposit {token.name} tokens and earn {!token.name.endsWith("-DAI") ? "GAME" : "GAME-USDC.e"} on Avalanche launch.
            </Typography>
            <div className='info-wrap'>
              <Grid container spacing={3}>

                  <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">
                          {getDisplayBalance(migrationBalance, 18, 2)} / {getDisplayBalance(maxMigration, 18, 2)}
                      </Typography>
                      <Typography variant="body1" component="p" className={classes.blueGlow}>Migration Balance</Typography>
                  </Grid>
                  <Grid item xs={6}>
                      <Typography variant="h4" color="var(--extra-color-2)">
                          {token.migrationMultiplier}
                      </Typography>
                      <Typography variant="body1" component="p" className={classes.blueGlow}>Migration Multiplier</Typography>
                  </Grid>

              </Grid>
            </div>
            {approveStatus !== ApprovalState.APPROVED ? (
                <Box className="buttonWrap">
                    <Button
                        disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                        variant="contained"
                        style={{ marginTop: '20px' }}
                        onClick={approve}
                    >
                        Approve
                    </Button>
                </Box>
            ) : (
                <Box className="buttonWrap">
                <Button variant="contained" style={{ marginTop: '20px' }} onClick={onPresentDeposit}>
                    Migrate
                </Button>
                </Box>
            )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MigrationCard;
