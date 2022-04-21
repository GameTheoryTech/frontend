import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { AllocationTime } from '../tomb-finance/types';

const useUnstakeTimerDungeon = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const tombFinance = useTombFinance();

  useEffect(() => {
    if (tombFinance) {
      tombFinance.getUserUnstakeTimeDungeon().then(setTime);
    }
  }, [tombFinance]);
  return time;
};

export default useUnstakeTimerDungeon;
