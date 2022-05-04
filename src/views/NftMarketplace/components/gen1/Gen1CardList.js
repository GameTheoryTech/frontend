import { useContext } from 'react'
import { ethers } from 'ethers'
import { Grid, Fade } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Gen1Card from './Gen1Card'
import { Web3Context } from '../../utils/Web3Provider'
import { mapOwnedTokenIdsAsMarketItemsGen1 } from '../../utils/nft'
import Datasort from "react-data-sort";
import SortTag from '../card/SortTag'

export default function Gen1CardList({ nfts, setNfts }) {
	const classes = useStyles();
	const { account, marketplaceContract, TheoryUnlockerGen1 } = useContext(Web3Context);

	async function updateNFT(index, tokenId) {
		const updatedNFt = await mapOwnedTokenIdsAsMarketItemsGen1(marketplaceContract, TheoryUnlockerGen1, account)(tokenId);
		setNfts(prevNfts => {
			const updatedNfts = [...prevNfts];
			updatedNfts[index] = updatedNFt;
			return updatedNfts;
		});
	}

	function Gen1NFT({ nft, index }) {
		 // if (nft.owner === account && nft.marketItemId && !nft.hasMarketApproval) {
    if (nft.owner === account && !nft.hasMarketApproval) {
			return <Gen1Card nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.owner === account && nft.hasMarketApproval) {
			return <Gen1Card nft={nft} action="sell" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.seller === account && !nft.sold) {
			return <Gen1Card nft={nft} action="cancel" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		if (nft.owner === ethers.constants.AddressZero) {
			return <Gen1Card nft={nft} action="buy" updateNFT={() => updateNFT(index, nft.tokenId)} />
		}

		return <Gen1Card nft={nft} action="none" />
	}

	return (
		<Datasort
      data={nfts}
      render={({
        data,
        setSortBy,
        sortBy,
        direction,
        toggleDirection
      }) => {
				return (
					<Grid>
						<SortTag
							setSortBy={setSortBy}
							sortBy={sortBy}
							direction={direction}
							toggleDirection={toggleDirection}
						/>
						<Grid container className={classes.grid} id="grid">
							{data.map((nft, i) =>
								<Fade in={true} key={i}>
									<Grid item xs={12} sm={6} md={4} className={classes.gridItem} >
										<Gen1NFT nft={nft} index={i} />
									</Grid>
								</Fade>
							)}
						</Grid>
					</Grid>
        );
      }}
    />
	);
};

const useStyles = makeStyles((theme) => ({
	grid: {
		spacing: 3,
		alignItems: 'stretch',
		marginTop: 60,
		'@media (max-width: 640px)': {
      marginTop: 120
    }
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