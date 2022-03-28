import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber} from "ethers";

const useMaxLevel = () => {
  const [maxLevel, setMaxLevel] = useState(BigNumber.from(5));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getMaxLevel() {
      try {
        setMaxLevel(await tombFinance.getMaxTheoryUnlockerLevel());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getMaxLevel();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return maxLevel;
};

export default useMaxLevel;
