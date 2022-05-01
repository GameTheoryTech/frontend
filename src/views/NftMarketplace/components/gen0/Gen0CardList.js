import { useContext } from 'react'
import { ethers } from 'ethers'
import Grid from '@mui/material/Grid'
import Fade from '@mui/material/Fade'
import { makeStyles } from '@mui/styles'
import Gen0Card from './Gen0Card'
import { Web3Context } from '../../utils/Web3Provider'
import { mapOwnedTokenIdsAsMarketItems } from '../../utils/nft'

export default function Gen0CardList({ nfts, setNfts }) {
	const classes = useStyles();
	const { account, marketplaceContract, TheoryUnlocker} = useContext(Web3Context);

	async function updateNFT(index, tokenId) {
		const updatedNFt = await mapOwnedTokenIdsAsMarketItems(marketplaceContract, TheoryUnlocker, account)(tokenId);
		setNfts(prevNfts => {
			const updatedNfts = [...prevNfts];
			updatedNfts[index] = updatedNFt;
			return updatedNfts;
		});
	}

	function Gen0NFT({ nft, index }) {
    if (nft.owner === account && !nft.hasMarketApproval) {
			return <Gen0Card nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.owner === account && nft.hasMarketApproval) {
			return <Gen0Card nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.seller === account && !nft.sold) {
			return <Gen0Card nft={nft} action="cancel" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.owner === ethers.constants.AddressZero) {
			return <Gen0Card nft={nft} action="buy" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		return <Gen0Card nft={nft} action="none" />
	}

	return (
		<Grid container className={classes.grid} id="grid">
			{nfts.map((nft, i) =>
				<Fade in={true} key={i}>
					<Grid item xs={12} sm={6} md={4} className={classes.gridItem} >
						<Gen0NFT nft={nft} index={i} />
					</Grid>
				</Fade>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	grid: {
		spacing: 3,
		alignItems: 'stretch'
	},
	gridItem: {
		display: 'flex',
		transition: 'all .3s',
		
		'@media (min-width: 1000px)': {
      maxWidth: '33.3% !important'
    },
		'@media (min-width: 641px) and (max-width: 999px)': {
      maxWidth: '50% !important'
    },
		'@media (max-width: 640px)': {
      maxWidth: '100% !important'
    }
	}
}));