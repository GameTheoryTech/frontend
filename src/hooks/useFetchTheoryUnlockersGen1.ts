import { useCallback, useState, useEffect } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import { PoolStats } from '../tomb-finance/types';
import config from '../config';
import axios from "axios";

const useFetchTheoryUnlockersGen1 = () => {
  const tombFinance = useTombFinance();

  const [theoryUnlockers, setTheoryUnlockers] = useState([]);

  const fetchTheoryUnlockers = useCallback(async () => {
    let unlockers : Array<any> = [];
    if(!tombFinance?.isUnlocked) return unlockers;
    const len = (await tombFinance.getTheoryUnlockerGen1OwnerSupply(tombFinance.myAccount)).toNumber();
    for(let i = 0; i < len; ++i) {
      const tokenId = await tombFinance.getTheoryUnlockerGen1AtOwnerIndex(tombFinance.myAccount, i);
      const tokenUri = (await tombFinance.getTheoryUnlockerGen1TokenUri(tokenId)).replace("ipfs://", "https://ipfs.io/ipfs/");
        const json = (await axios(tokenUri, {timeout: 30000})).data;
      json.token_id = tokenId;
      json.image = json.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      json.animation_url = json.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/");
      json.level = await tombFinance.getTheoryUnlockerGen1Level(tokenId);
      json.unlockAmount = await tombFinance.getTheoryUnlockerGen1UnlockAmount(tombFinance.myAccount, tokenId);
      json.timeLeftToLevel = await tombFinance.getTheoryUnlockerGen1TimeLeftToLevel(tokenId);
      json.cost = await tombFinance.getTheoryUnlockerGen1LevelUpCost(json.level);
      json.merged = await tombFinance.getTheoryUnlockerGen1Merged(json.level);
      unlockers.push(json);
    }
    setTheoryUnlockers(unlockers);
  }, [tombFinance]);

  useEffect(() => {
    fetchTheoryUnlockers().catch((err) => console.error(`Failed to fetch Theory Unlockers (Gen 1): ${err.stack}`));
    const refreshInterval = setInterval(fetchTheoryUnlockers, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setTheoryUnlockers, tombFinance, fetchTheoryUnlockers]);

  return theoryUnlockers;
};

export default useFetchTheoryUnlockersGen1;
