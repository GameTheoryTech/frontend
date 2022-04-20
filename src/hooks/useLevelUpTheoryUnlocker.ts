import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {BigNumber} from "ethers";

const useLevelUpTheoryUnlocker = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleLevelUp = useCallback(
    (tokenId: BigNumber | number) => {
      handleTransactionReceipt(
          tombFinance?.levelUpTheoryUnlocker(tokenId),
        `Level up NFT ${tokenId}.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onLevelUp: handleLevelUp };
};

export default useLevelUpTheoryUnlocker;
