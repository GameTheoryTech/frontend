import React, { useContext, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { Web3Context } from '../../utils/Web3Provider'
import { mapOwnedTokenIdsAsMarketItemsGen1, getUniqueOwnedTokenIdsGen1 } from '../../utils/nft'
import Gen1CardList from '../gen1/Gen1CardList';

export default function MyGen1() {
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { account, marketplaceContract, TheoryUnlockerGen1, isReady, hasWeb3 } = useContext(Web3Context);
	
	useEffect(() => {
		loadNFTs();
	}, [account, isReady, TheoryUnlockerGen1]);
	
	async function loadNFTs() {
		if (!isReady || !hasWeb3) return <></>
		const myUniqueOwnedTokenIds = await getUniqueOwnedTokenIdsGen1(TheoryUnlockerGen1, account)
    const myNfts = await Promise.all(myUniqueOwnedTokenIds.map(
      mapOwnedTokenIdsAsMarketItemsGen1(marketplaceContract, TheoryUnlockerGen1, account)
    ))
	
    setNfts(myNfts)
		setIsLoading(false)
	};

	if (isLoading) return <CircularProgress />
	if (!isLoading && !nfts.length) return <h1>No NFTs</h1>
	return (
		isReady && (
			<Gen1CardList nfts={nfts} setNfts={setNfts} />
		)
	);
};
