import { useCallback } from 'react';
import useTombFinance from './useTombFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useUnlockGame = () => {
  const tombFinance = useTombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleUnlockGame = useCallback(
    () => {
      handleTransactionReceipt(
        tombFinance?.unlockGame(),
        `Unlock GAME.`,
      );
    },
    [tombFinance, handleTransactionReceipt],
  );
  return { onUnlockGame: handleUnlockGame };
};

export default useUnlockGame;
