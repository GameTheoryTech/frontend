import { useCallback, useState, useEffect } from 'react';
import useTombFinance from './useTombFinance';
import { Bank } from '../tomb-finance';
import { PoolStats } from '../tomb-finance/types';
import config from '../config';
import axios from "axios";
import {BigNumber} from "ethers";

const useFetchTheoryUnlockersGen1 = () => {
  const tombFinance = useTombFinance();

  const [theoryUnlockers, setTheoryUnlockers] = useState([]);

  const fetchTheoryUnlockers = useCallback(async () => {
    let unlockers : Array<any> = [];
    if(!tombFinance?.isUnlocked) return unlockers;
    const len = (await tombFinance?.getTheoryUnlockerGen1OwnerSupply(tombFinance?.myAccount)).toNumber();
    for(let i = 0; i < len; ++i) {
      const tokenId = await tombFinance?.getTheoryUnlockerGen1AtOwnerIndex(tombFinance?.myAccount, i);
      const tokenUri = (await tombFinance?.getTheoryUnlockerGen1TokenUri(tokenId)).replace("ipfs://", "https://") + ".ipfs.nftstorage.link";;
        const json = (await axios(tokenUri, {timeout: 30000})).data;
      json.token_id = tokenId;
      json.image = json.image.replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
      json.animation_url = json.animation_url.replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
      json.level = await tombFinance?.getTheoryUnlockerGen1Level(tokenId);
      json.unlockAmount = await tombFinance?.getTheoryUnlockerGen1UnlockAmount(tombFinance?.myAccount, tokenId);
      json.timeLeftToLevel = await tombFinance?.getTheoryUnlockerGen1TimeLeftToLevel(tokenId);
      json.cost = await tombFinance?.getTheoryUnlockerGen1LevelUpCost(json.level);
      json.maxCost = BigNumber.from(0);
      let timestamp = BigNumber.from(Math.floor(Date.now() / 1000));
      let lastLevelTime = await tombFinance?.getTheoryUnlockerGen1LastLevelTime(json.token_id)
      let currentLevel = json.level;
      let timeToLevel = await tombFinance?.getTheoryUnlockerGen1TimeToLevel();
      let maxLevel = await tombFinance?.getMaxTheoryUnlockerGen1Level();
      while(currentLevel.lt(maxLevel) && timestamp.gte(lastLevelTime.add(timeToLevel))) {
        json.maxCost = json.maxCost.add(await tombFinance?.getTheoryUnlockerGen1LevelUpCost(currentLevel));
        lastLevelTime = lastLevelTime.add(timeToLevel);
        currentLevel = currentLevel.add(1);
      }
      json.merged = await tombFinance?.getTheoryUnlockerGen1Merged(json.level);
      unlockers.push(json);
      await new Promise(r => setTimeout(r, 1000));
    }
    setTheoryUnlockers(unlockers);
  }, [tombFinance]);

  useEffect(() => {
    fetchTheoryUnlockers().catch((err) => console.error(`Failed to fetch Theory Unlockers (Gen 1): ${err.stack}`));
    const refreshInterval = setInterval(fetchTheoryUnlockers, 60000);
    return () => clearInterval(refreshInterval);
  }, [setTheoryUnlockers, tombFinance, fetchTheoryUnlockers]);

  return theoryUnlockers;
};

export default useFetchTheoryUnlockersGen1;
