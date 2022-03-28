import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useUnlockTheory = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleUnlockTheory = useCallback(
    (tokenId : BigNumber | number) => {
      handleTransactionReceipt(
        tombFinance.unlockTheory(tokenId),
        `Unlock LTHEORY to THEORY.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onUnlockTheory: handleUnlockTheory };
};

export default useUnlockTheory;
