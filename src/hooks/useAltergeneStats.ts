import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import {AltergeneStat, TokenStat} from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useAltergeneStats = () => {
  const [stat, setStat] = useState<AltergeneStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchAltergeneStat(){
      try {
        if(!tombFinance?.isUnlocked) return;
        setStat(await tombFinance?.getAltergeneStat());
      }
      catch(err){
        console.error(err)
      }
    }
    fetchAltergeneStat();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useAltergeneStats;
