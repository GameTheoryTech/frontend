import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Grid, Container } from '@mui/material';
import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import Markets from './components/markets';
import MyNFTs from './components/myNfts';
import { createGlobalStyle } from 'styled-components';
import Web3Provider from './utils/Web3Provider';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './utils/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const NftMarketplace = (props) => {
	const { emotionCache = clientSideEmotionCache } = props
  const classes = useStyles();
	const { account } = useWallet();
	const [activeTab, setActiveTab] = useState("tab1");

	const handleTab1 = () =>{
			setActiveTab("tab1");
	};
	const handleTab2 = () => {
			setActiveTab("tab2");
	};

    return (
    <Page>
				<Web3Provider>
						<CacheProvider value={emotionCache}>
							<BackgroundImage />
							{!!account ? (
								<>
									<Typography color="textPrimary" align="center" variant="h3" gutterBottom style={{ marginTop: 40 }}>
										NFT Marketplace
									</Typography>
										<Container maxWidth="lg">
											<Box >
												<Grid className={classes.toggleNav} >
													<Typography className={activeTab === "tab1" ? classes.tabActive : classes.tabs} onClick={handleTab1}>Market Place</Typography>
													<Typography className={activeTab === "tab2" ? classes.tabActive : classes.tabs} onClick={handleTab2}>My NFTs</Typography>
												</Grid>
												<Box className={classes.nftField} >
														{activeTab ==="tab1" ? <Markets /> : <MyNFTs />}
												</Box>
											</Box>
										</Container>
								</>
							) : (
								<UnlockWallet />
							)}
						</CacheProvider>
			</Web3Provider>
    </Page>
  );
};



const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	* {
		color: var(--white) !important;
	}
`;

const useStyles = makeStyles((theme) => ({
	
	nftField: {
		display: "flex",
		justifyContent: "center"
	},

	toggleNav: {
		display: "flex",
		margin: '40px 16px',
		boxShadow: '0px 2px 4px var(--extra-color-1)'
	},

	tabs: {
		fontSize: 20,
		width: '50%',
		textAlign: 'center',
		color: "#9a9797 !important",
		padding: "16px 0 12px",
		cursor: "pointer"
	},

	tabActive: {
		fontSize: 20,
		width: '50%',
		textAlign: 'center',
		color: "#FFF",
		padding: "16px 0 12px",
		backgroundColor: "#ff26de56",
		cursor: "pointer"
	}
}));

export default NftMarketplace;
