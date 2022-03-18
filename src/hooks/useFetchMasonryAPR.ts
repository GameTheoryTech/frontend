import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const [dpr, setDpr] = useState<number>(0);
  const tombFinance = useTombFinance();
  const { slowRefresh } = useRefresh(); 

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await tombFinance.getMasonryAPR());
        setDpr(await tombFinance.getMasonryDPR());
      } catch(err){
        console.error(err);
      }
    }
   fetchMasonryAPR();
  }, [setApr, setDpr, tombFinance, slowRefresh]);

  return {apr,dpr};
};

export default useFetchMasonryAPR;
