import { Typography } from '@mui/material'
import { ethers } from 'ethers'
import { useContext } from 'react'
import { shortenAddress } from '../../utils/format'
import { Web3Context } from '../../utils/Web3Provider'

function getAddressText(address, account) {
	if (address === ethers.constants.AddressZero) return 'Marketplace';
	if (address === account) return 'You';
	return shortenAddress(address);
}

export default function CardAddresses({ nft }) {
	const isAvailable = !nft.sold && !nft.canceled;
	const { account } = useContext(Web3Context);
	return (
		<>
			<Typography variant="body2" color="text.secondary">
				Owner: {getAddressText(nft.owner, account)}
			</Typography>
			{isAvailable &&
				<Typography variant="body2" color="text.secondary">
					Seller: {getAddressText(nft.seller, account)}
				</Typography>
			}
		</>
	);
};
