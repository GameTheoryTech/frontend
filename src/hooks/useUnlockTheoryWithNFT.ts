import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useUnlockTheoryWithNFT = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleUnlockTheory = useCallback(
    (tokenId: BigNumber | number) => {
      handleTransactionReceipt(
        tombFinance.unlockTheoryWithNFT(tokenId),
        `Unlock LTHEORY to THEORY with NFT ${tokenId}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onUnlockTheory: handleUnlockTheory };
};

export default useUnlockTheoryWithNFT;
