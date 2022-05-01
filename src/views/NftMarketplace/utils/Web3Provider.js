import React, { createContext, useCallback, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import useTombFinance from '../../../hooks/useTombFinance'

const contextDefaultValues = {
	account: '',
	connectWallet: () => { },
	marketplaceContract: null,
	TheoryUnlocker: null,
	TheoryUnlockerGen1: null,
	GameContract: null,
	isReady: false,
	hasWeb3: false
};

export const Web3Context = createContext(
	contextDefaultValues
);

export default function Web3Provider({ children }) {
	const tombFinance = useTombFinance();

	const [hasWeb3, setHasWeb3] = useState(contextDefaultValues.hasWeb3);
	const [account, setAccount] = useState(contextDefaultValues.account);
	const [marketplaceContract, setMarketplaceContract] = useState(contextDefaultValues.marketplaceContract);
	const [TheoryUnlocker, setTheoryUnlocker] = useState();
	const [TheoryUnlockerGen1, setTheoryUnlockerGen1] = useState();
	const [GameContract, setGameContract] = useState();
	const [isReady, setIsReady] = useState(contextDefaultValues.isReady);

	useEffect(() => {
		initializeWeb3();
	}, []);


	const getTheoryUnlockers = useCallback(async () => {	
		setIsReady(false);
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const TheoryUnlockerAddress = await tombFinance?.getTheoryUnlockerAddress();
		const TheoryUnlockerABI = await tombFinance?.getTheoryUnlockerABI();
		const TheoryUnlocker = new ethers.Contract(TheoryUnlockerAddress, TheoryUnlockerABI, signer);
		setTheoryUnlocker(TheoryUnlocker);

		const TheoryUnlockerGen1Address = await tombFinance?.getTheoryUnlockerGen1Address();
		const TheoryUnlockerGen1ABI = await tombFinance?.getTheoryUnlockerGen1ABI();
		const TheoryUnlockerGen1 = new ethers.Contract(TheoryUnlockerGen1Address, TheoryUnlockerGen1ABI, signer);
		setTheoryUnlockerGen1(TheoryUnlockerGen1);

		const MarketplaceAddress = await tombFinance?.getMarketplaceAddress();
		const MarketplaceABI = await tombFinance?.getMarketplaceABI();
		const MarketplaceContract = new ethers.Contract(MarketplaceAddress, MarketplaceABI, signer);
		setMarketplaceContract(MarketplaceContract);


		const GameContractAddress = await tombFinance?.getGameContractAddress();
		const GameContractABI = await tombFinance?.getGameContractABI();
		const GameContract = new ethers.Contract(GameContractAddress, GameContractABI, signer);
		setGameContract(GameContract);

		setIsReady(true);
	}, [tombFinance]);
	
	useEffect(() => {
		getTheoryUnlockers().catch((err) => console.error(`Failed to fetch Theory Unlockers: ${err.stack}`));
	}, [tombFinance, getTheoryUnlockers, setTheoryUnlocker, setTheoryUnlockerGen1, setMarketplaceContract, setGameContract]);


	async function initializeWeb3WithoutSigner() {
		const provider = new ethers.providers.JsonRpcProvider();
		setHasWeb3(false);
	};
	
	async function initializeWeb3() {
		try {
			if (!window.ethereum) {
					await initializeWeb3WithoutSigner()
					return
				}
				
			let onAccountsChangedCooldown = false
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			setHasWeb3(true)
			const provider = new ethers.providers.Web3Provider(connection, 'any')
			await getAndSetWeb3ContextWithSigner(provider)

			function onAccountsChanged(accounts) {
				if (onAccountsChangedCooldown) return
				onAccountsChangedCooldown = true
				setTimeout(() => { onAccountsChangedCooldown = false }, 1000)
				const changedAddress = ethers.utils.getAddress(accounts[0])
				setAccount(changedAddress)
			}

			connection.on('accountsChanged', onAccountsChanged)
			connection.on('chainChanged', initializeWeb3)
		} catch (error) {
			initializeWeb3WithoutSigner()
			console.log(error)
		}
	};

	async function getAndSetWeb3ContextWithSigner(provider) {
		const signer = provider.getSigner()
		const signerAddress = await signer.getAddress()
		setAccount(signerAddress)
	}

	return (
		<Web3Context.Provider
			value={{
				account,
				marketplaceContract,
				TheoryUnlocker,
				TheoryUnlockerGen1,
				GameContract,
				isReady,
				initializeWeb3,
				hasWeb3				
			}}
		>
			{children}
		</Web3Context.Provider>
	);
};
