import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Grid, Card, CardActions, CardContent, CardMedia, Button, Divider, Box, CircularProgress, Typography } from '@mui/material'
import { Web3Context } from '../../utils/Web3Provider'
import NFTPrice from '../card/NFTPrice'
import CardAddresses from '../card/CardAddresses'
import PriceTextField from '../card/PriceTextField'
import ReactPlayer from 'react-player';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove'
import useTombFinance from '../../../../hooks/useTombFinance'

const APPROVE_AMOUNT = ethers.constants.MaxUint256;

export default function Gen0Card({ nft, action, updateNFT }) {
	const { account, TheoryUnlocker, marketplaceContract, GameContract, hasWeb3 } = useContext(Web3Context);
	const [isHovered, setIsHovered] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [priceError, setPriceError] = useState(false);
	const [newPrice, setPrice] = useState(0);
	const classes = useStyles();

	const tombFinance = useTombFinance();
	const [approveStatus, approve] = useApprove(tombFinance?.TOMB, tombFinance?.contracts.Marketplace.address);

	const actions = {
		buy: {
			text: 'buy',
			method: buyNft
		},
		cancel: {
			text: 'cancel',
			method: cancelNft
		},
		approve: {
			text: 'Approve for selling',
			method: approveNft
		},
		sell: {
			text: 'Sell',
			method: sellNft
		}
	};

  async function buyNft (nft) {
		const transaction = await marketplaceContract.createMarketSale(TheoryUnlocker.address, nft.marketItemId);
		await transaction.wait();
		updateNFT();
	}
	
	async function approveBuy () {
		const transaction = await GameContract.approve(marketplaceContract.address, APPROVE_AMOUNT);
		await transaction.wait();
		// updateNFT();
  }

  async function cancelNft (nft) {
		const transaction = await marketplaceContract.cancelMarketItem(TheoryUnlocker.address, nft.marketItemId);
		await transaction.wait();
		updateNFT();
  }

	async function approveNft(nft) {
		const approveTx = await TheoryUnlocker.approve(marketplaceContract.address, nft.tokenId);
		await approveTx.wait();
		updateNFT();
		return approveTx;
  }

  async function sellNft (nft) {
    if (!newPrice) {
			setPriceError(true);
			return;
    }
    setPriceError(false)
		const priceInWei = ethers.utils.parseUnits(newPrice, 'ether');
		const transaction = await marketplaceContract.createMarketItem(TheoryUnlocker.address, nft.tokenId, 0, priceInWei);
		await transaction.wait();
		updateNFT();
		return transaction;
  }

  async function onClick (nft) {
    try {
			setIsLoading(true);
			await actions[action].method(nft);
    } catch (error) {
			console.log(error);
    } finally {
			setIsLoading(false);
    }
  }

	return (
		<Card
			className={classes.root}
			raised={isHovered}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<ReactPlayer className="video" url={nft.animation_url} controls={false} muted={true} playing={true} loop={true} width='100%' height='auto' />
			
			<CardContent className={classes.cardContent} >
				<Grid container className="bottom-meta" justify="center" alignItems="center">
					<Grid item xs={4}>
						<Typography variant="body1">Generation</Typography>
						<Typography variant="h4">0</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="body1">Tier</Typography>
						<Typography variant="h4">{nft.attributes[0].value}</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="body1">Level</Typography>
						<Typography variant="h4">{nft.level.toNumber()}</Typography>
					</Grid>
				</Grid>
				<Divider className={classes.firstDivider} />
				<Box className={classes.addressesAndPrice}>
					<div className={classes.addressesContainer}>
						<Typography variant="body2">Token ID:{nft.tokenId.toNumber()}</Typography>
						<CardAddresses className={classes.addresses} nft={nft} />
					</div>
					<div className={classes.priceContainer}>
						{action === 'sell'
							? <PriceTextField error={priceError} disabled={isLoading} onChange={e => setPrice(e.target.value)} />
							: <NFTPrice nft={nft} />
						}
					</div>
				</Box>
			</CardContent>
			<CardActions className={classes.cardActions}>
				{nft.owner === ethers.constants.AddressZero && approveStatus !== ApprovalState.APPROVED && nft.seller !== account ? (
					<Button className={classes.btn} size="small" onClick={approveBuy}>
						Approve buy
					</Button>
				) : (
					<Button className={classes.btn} size="small" onClick={() => !isLoading && onClick(nft)}>
						{isLoading
							? <CircularProgress size="20px" />
							: hasWeb3 && actions[action].text
						}
					</Button>
				)}
			</CardActions>
		</Card>
	);
};

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    margin: 15,
    flexGrow: 1,
		height: 'auto',
		
		'& .video': {
			'& > video': {
				borderTopLeftRadius: 17,
				borderTopRightRadius: 17
			}
		}
	},
  cardContent: {
    padding: '9px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  firstDivider: {
		margin: '10px 0',
		borderColor: '#e4e2e226'
  },
  addressesAndPrice: {
    display: 'flex',
    flexDirection: 'row'
  },
  addressesContainer: {
    margin: 'auto',
    width: '60%',
		textAlign: 'left'
	},
  priceContainer: {
    width: '40%',
		margin: 'auto',
		'& input': {
			fontSize: '20px'
		}
  },
  cardActions: {
    padding: '10px 16px 16px'
	},
	btn: {
		background: '#ff24df',
		fontSize: 15
	}
})