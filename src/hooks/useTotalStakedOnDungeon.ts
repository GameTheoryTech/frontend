import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnDungeon = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await tombFinance.getTotalStakedInDungeon());
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

export default useTotalStakedOnDungeon;
