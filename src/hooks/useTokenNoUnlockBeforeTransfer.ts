import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20Lockable from '../tomb-finance/ERC20Lockable';
import useTombFinance from './useTombFinance';
import config from '../config';

const useTokenNoUnlockBeforeTranfer = (token: ERC20Lockable) => {
  const [noUnlock, setNoUnlock] = useState(false);
  const tombFinance = useTombFinance();
  const isUnlocked = tombFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    setNoUnlock(await token.noUnlockBeforeTransfer(tombFinance?.myAccount));
  }, [token, tombFinance?.myAccount]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(`Failed to fetch token lock: ${err.stack}`));
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked, token, fetchBalance, tombFinance]);

  return noUnlock;
};

export default useTokenNoUnlockBeforeTranfer;
