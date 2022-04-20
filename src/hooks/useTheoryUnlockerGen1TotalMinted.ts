import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber, BigNumberish} from "ethers";

const useTotalMintedGen1 = (level : BigNumberish) => {
  const [totalMinted, setTotalMinted] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getTotalMinted() {
      try {
        setTotalMinted(await tombFinance?.getTheoryUnlockerGen1TotalMinted(level));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getTotalMinted();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return totalMinted;
};

export default useTotalMintedGen1;
