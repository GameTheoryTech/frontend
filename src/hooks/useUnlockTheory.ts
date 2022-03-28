import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useUnlockTheory = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleUnlockTheory = useCallback(
    () => {
      handleTransactionReceipt(
        tombFinance.unlockTheory(),
        `Unlock THEORY.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onUnlockTheory: handleUnlockTheory };
};

export default useUnlockTheory;
