import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMergeTheoryUnlocker = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMerge = useCallback(
    (tokenId1: string, tokenId2: string) => {
      handleTransactionReceipt(tombFinance.mergeTheoryUnlocker(tokenId1, tokenId2), `Merge Theory Unlocker ${tokenId1} with Theory Unlocker ${tokenId2}.`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMerge: handleMerge };
};

export default useMergeTheoryUnlocker;
