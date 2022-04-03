import { useCallback, useState, useEffect } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import { PoolStats } from '../tomb-finance/types';
import config from '../config';
import axios from "axios";

const useFetchTheoryUnlockers = () => {
  const tombFinance = useTombFinance();

  const [theoryUnlockers, setTheoryUnlockers] = useState([]);

  const fetchTheoryUnlockers = useCallback(async () => {
    let unlockers : Array<any> = [];
    if(!tombFinance?.isUnlocked) return unlockers;
    const len = (await tombFinance.getTheoryUnlockerOwnerSupply(tombFinance.myAccount)).toNumber();
    for(let i = 0; i < len; ++i) {
      const tokenId = await tombFinance.getTheoryUnlockerAtOwnerIndex(tombFinance.myAccount, i);
      const tokenUri = (await tombFinance.getTheoryUnlockerTokenUri(tokenId)).replace("ipfs://", "https://ipfs.io/ipfs/");
      const json = (await axios(tokenUri)).data;
      json.token_id = tokenId;
      json.image = json.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      json.animation_url = json.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/");
      json.level = await tombFinance.getTheoryUnlockerLevel(tokenId);
      json.unlockAmount = await tombFinance.getTheoryUnlockerUnlockAmount(tombFinance.myAccount, tokenId);
      json.timeLeftToLevel = await tombFinance.getTheoryUnlockerTimeLeftToLevel(tokenId);
      unlockers.push(json);
    }
    setTheoryUnlockers(unlockers);
  }, [tombFinance]);

  useEffect(() => {
    fetchTheoryUnlockers().catch((err) => console.error(`Failed to fetch Theory Unlockers: ${err.stack}`));
    const refreshInterval = setInterval(fetchTheoryUnlockers, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setTheoryUnlockers, tombFinance, fetchTheoryUnlockers]);

  return theoryUnlockers;
};

export default useFetchTheoryUnlockers;
