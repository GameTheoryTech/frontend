import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useMergeTheoryUnlockerGen1 = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleMerge = useCallback(
    (tokenId1: string, tokenId2: string) => {
      handleTransactionReceipt(tombFinance.mergeTheoryUnlockerGen1(tokenId1, tokenId2), `(Gen 1) Merge Theory Unlocker ${tokenId1} with Theory Unlocker ${tokenId2}.`);
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onMerge: handleMerge };
};

export default useMergeTheoryUnlockerGen1;
