import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useUnlockTheoryWithNFTGen1 = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleUnlockTheory = useCallback(
    (tokenId: BigNumber | number) => {
      handleTransactionReceipt(
        tombFinance?.unlockTheoryWithNFTGen1(tokenId),
        `Unlock LTHEORY to THEORY with Gen 1 NFT ${tokenId}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onUnlockTheory: handleUnlockTheory };
};

export default useUnlockTheoryWithNFTGen1;
