import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber, BigNumberish} from "ethers";

const useSupplyGen1 = (level : BigNumberish) => {
  const [supply, setSupply] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getSupply() {
      try {
        setSupply(await tombFinance?.getTheoryUnlockerGen1Supply(level));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getSupply();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return supply;
};

export default useSupplyGen1;
