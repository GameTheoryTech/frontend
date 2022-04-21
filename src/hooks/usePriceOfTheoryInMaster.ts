import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const usePriceOfTheoryInMaster = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const isUnlocked = tombFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await tombFinance.getPriceOfTheoryInMaster());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, tombFinance]);
  return balance;
};

export default usePriceOfTheoryInMaster;
