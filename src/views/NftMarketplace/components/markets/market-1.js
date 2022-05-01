import { useContext, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import Gen1CardList from '../gen1/Gen1CardList'
import { Web3Context } from '../../utils/Web3Provider'
import { mapAvailableMarketItemsGen1 } from '../../utils/nft'


export default function Market1 () {
	const [nfts, setNfts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { marketplaceContract, TheoryUnlockerGen1, isReady } = useContext(Web3Context)

	useEffect(() => {
      loadNFTs();
	}, [isReady]);

	async function loadNFTs() {
		if (!isReady) return;
		
		const data = await marketplaceContract.fetchAvailableMarketItems()
		let marketItems = [];
		for (let i = 0; i < data.length; ++i) { 
			if ((data[i].genNumber).toNumber() == 1) {
				marketItems.push(data[i]); 
			}
		}
    const items = await Promise.all(marketItems.map(mapAvailableMarketItemsGen1(TheoryUnlockerGen1)))
		setNfts(items)
    setIsLoading(false)
  }

  if (isLoading) return <CircularProgress />
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
	return (
		isReady && (
			<Gen1CardList nfts={nfts} setNfts={setNfts} />
		)
	);
};
 