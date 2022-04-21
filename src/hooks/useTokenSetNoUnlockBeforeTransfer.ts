import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20Lockable from '../tomb-finance/ERC20Lockable';
import useTombFinance from './useTombFinance';
import config from '../config';
import useHandleTransactionReceipt from "./useHandleTransactionReceipt";

const useSetTokenNoUnlockBeforeTransfer = (token: ERC20Lockable) => {
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSetTokenNoUnlockBeforeTransfer = useCallback(
      () => {
        handleTransactionReceipt(
            token.setNoUnlockBeforeTransfer(true),
            `Approve Unlock On Claim`,
        );
      },
      [token, handleTransactionReceipt],
  );
  return { onSetTokenNoUnlockBeforeTransfer: handleSetTokenNoUnlockBeforeTransfer };
};

export default useSetTokenNoUnlockBeforeTransfer;
