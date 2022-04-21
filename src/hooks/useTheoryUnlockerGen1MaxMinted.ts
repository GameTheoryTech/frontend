import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber, BigNumberish} from "ethers";

const useMaxMintedGen1 = (level : BigNumberish) => {
  const [maxMinted, setMaxMinted] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getMaxMinted() {
      try {
        setMaxMinted(await tombFinance?.getTheoryUnlockerGen1MaxMinted(level));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getMaxMinted();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return maxMinted;
};

export default useMaxMintedGen1;
