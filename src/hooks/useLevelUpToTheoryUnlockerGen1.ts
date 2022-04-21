import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useLevelUpToTheoryUnlockerGen1 = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleLevelUp = useCallback(
    (tokenId: BigNumber | number, level: BigNumber | number) => {
      handleTransactionReceipt(
        tombFinance?.levelUpToTheoryUnlockerGen1(tokenId, level),
        `Level up Gen 1 NFT ${tokenId}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onLevelUpTo: handleLevelUp };
};

export default useLevelUpToTheoryUnlockerGen1;
