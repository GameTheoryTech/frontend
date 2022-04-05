import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';
import {BigNumber} from "ethers";

const useOwnerSupplyGen1 = () => {
  const [ownerSupply, setOwnerSupply] = useState(BigNumber.from(0));
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = tombFinance?.isUnlocked;

  useEffect(() => {
    async function getOwnerSupply() {
      try {
        setOwnerSupply(await tombFinance.getTheoryUnlockerGen1OwnerSupply(tombFinance.myAccount));
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      getOwnerSupply();
    }
  }, [isUnlocked, tombFinance, slowRefresh]);

  return ownerSupply;
};

export default useOwnerSupplyGen1;
