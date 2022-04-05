import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useLevelUpTheoryUnlockerGen1 = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleLevelUp = useCallback(
    (tokenId: BigNumber | number) => {
      handleTransactionReceipt(
        tombFinance.levelUpTheoryUnlockerGen1(tokenId),
        `Level up Gen 1 NFT ${tokenId}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onLevelUp: handleLevelUp };
};

export default useLevelUpTheoryUnlockerGen1;
