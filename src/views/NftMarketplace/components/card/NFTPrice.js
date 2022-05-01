import { Typography } from '@mui/material'
import Game from '../../../../assets/img/GAME.png'
// import Image from 'material-ui-image'

function getPriceText (nft) {
	const { sold, canceled } = nft;
  if (sold) {
    return 'Sold for'
  }

  if (canceled) {
    return 'Offered for'
  }

	return 'Price'
}

export default function NFTPrice ({ nft }) {
	const priceText = getPriceText(nft);

	return (
		<div style={{ textAlign: 'center' }}>

			<Typography
				variant="h6"
			>
				{priceText}
			</Typography>
			<Typography
				gutterBottom
				variant="h4"
			>
				<span style={{ display: 'inline-block', transform: 'translateY(3px)' }}>
					<img
						alt='Game'
						src={Game}
						width="25px"
						height="25px"
					/>
				</span>
				{' '}{nft.price}
			</Typography>
		</div>
	);
};
