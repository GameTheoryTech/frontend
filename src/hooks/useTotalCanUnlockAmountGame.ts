import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import config from '../config';

const useTotalCanUnlockAmountGame = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    setBalance(await tombFinance?.totalCanUnlockAmountGame(tombFinance?.myAccount));
  }, [tombFinance?.myAccount]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(`Failed to fetch GAME unlock amount: ${err.stack}`));
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked, fetchBalance, tombFinance]);

  return balance;
};

export default useTotalCanUnlockAmountGame;
