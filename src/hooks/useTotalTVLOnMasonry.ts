import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const useTotalTVLOnMasonry = () => {
  const [totalStaked, setTotalStaked] = useState(0);
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        if(!tombFinance?.isUnlocked) return;
        setTotalStaked(await tombFinance?.getTotalTVLInMasonry());
      } catch(err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
     fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, tombFinance]);

  return totalStaked;
};

export default useTotalTVLOnMasonry;
