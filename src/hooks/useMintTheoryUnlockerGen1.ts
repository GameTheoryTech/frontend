import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMintTheoryUnlockerGen1 = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMint = useCallback(
    (amount: string) => {
      handleTransactionReceipt(tombFinance?.mintTheoryUnlockerGen1(amount, 200), `Mint level ${amount} Theory Unlocker Gen 1.`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMint: handleMint };
};

export default useMintTheoryUnlockerGen1;
