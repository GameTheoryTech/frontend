import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber} from "ethers";

const useTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getTotalSupply() {
      try {
        setTotalSupply(await tombFinance?.getTheoryUnlockerTotalSupply());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getTotalSupply();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return totalSupply;
};

export default useTotalSupply;
