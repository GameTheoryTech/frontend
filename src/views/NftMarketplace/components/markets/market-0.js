import { useContext, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import Gen0CardList from '../gen0/Gen0CardList'
import { Web3Context } from '../../utils/Web3Provider'
import { mapAvailableMarketItems } from '../../utils/nft'


export default function Market0 () {
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { marketplaceContract, TheoryUnlocker, isReady } = useContext(Web3Context)
	useEffect(() => {
      loadNFTs();
	}, [isReady]);

	async function loadNFTs() {
		if (!isReady) return;
		
		const data = await marketplaceContract.fetchAvailableMarketItems()
		let marketItems = [];
		for (let i = 0; i < data.length; ++i) { 
			if ((data[i].genNumber).toNumber() == 0) {
				marketItems.push(data[i]); 
			}
		}

    const items = await Promise.all(marketItems.map(mapAvailableMarketItems(TheoryUnlocker)))
    setNfts(items)
		setIsLoading(false)
  }

  if (isLoading) return <CircularProgress />
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
	return (
		isReady && (
			<Gen0CardList nfts={nfts} setNfts={setNfts} />
		)
	);
};
 