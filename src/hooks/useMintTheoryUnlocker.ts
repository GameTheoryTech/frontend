import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMintTheoryUnlocker = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMint = useCallback(
    (amount: string) => {
      handleTransactionReceipt(tombFinance.mintTheoryUnlocker(amount), `Mint level ${amount} Theory Unlocker.`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMint: handleMint };
};

export default useMintTheoryUnlocker;
