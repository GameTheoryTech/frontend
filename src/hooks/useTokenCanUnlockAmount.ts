import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20Lockable from '../tomb-finance/ERC20Lockable';
import useTombFinance from './useTombFinance';
import config from '../config';

const useCanUnlockAmount = (token: ERC20Lockable) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    setBalance(await token.canUnlockAmount(tombFinance?.myAccount));
  }, [token, tombFinance?.myAccount]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(`Failed to fetch token balance: ${err.stack}`));
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked, token, fetchBalance, tombFinance]);

  return balance;
};

export default useCanUnlockAmount;
