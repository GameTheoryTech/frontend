import React, { useContext, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { Web3Context } from '../../utils/Web3Provider'
import { mapOwnedTokenIdsAsMarketItems, getUniqueOwnedTokenIds } from '../../utils/nft'
import Gen0CardList from '../gen0/Gen0CardList';

export default function MyGen0() {
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { account, marketplaceContract, TheoryUnlocker, isReady, hasWeb3 } = useContext(Web3Context);
	
	useEffect(() => {
		loadNFTs();
	}, [account, isReady, TheoryUnlocker]);
	
	async function loadNFTs() {
		if (!isReady || !hasWeb3) return <></>
		const myUniqueOwnedTokenIds = await getUniqueOwnedTokenIds(TheoryUnlocker, account)
    const myNfts = await Promise.all(myUniqueOwnedTokenIds.map(
      mapOwnedTokenIdsAsMarketItems(marketplaceContract, TheoryUnlocker, account)
    ))
	
    setNfts(myNfts)
		setIsLoading(false)
	};

	if (isLoading) return <CircularProgress />
	if (!isLoading && !nfts.length) return <h1>No NFTs</h1>
	return (
		isReady && (
			<Gen0CardList nfts={nfts} setNfts={setNfts} />
		)
	);
};
 