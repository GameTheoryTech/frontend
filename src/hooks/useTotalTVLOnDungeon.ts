import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const useTotalTVLOnDungeon = () => {
  const [totalStaked, setTotalStaked] = useState(0);
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await tombFinance.getTotalTVLInDungeon());
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

export default useTotalTVLOnDungeon;
