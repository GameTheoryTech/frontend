import axios from 'axios'
import { ethers } from 'ethers'

export async function getTokenMetadataByTokenId (TheoryUnlocker, tokenId) {
	try {
		const tokenUri = (await TheoryUnlocker.tokenURI(tokenId)).replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
		const metadata = (await axios(tokenUri)).data;
		await new Promise(r => setTimeout(r, 1000));
		metadata.animation_url = metadata.animation_url.replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
		metadata.level = (await TheoryUnlocker.tokenInfo(tokenId)).level;
    return metadata
  } catch (error) {
    console.log(error)
  }
}

export function mapAvailableMarketItems (TheoryUnlocker) {
	return async (marketItem) => {
		const metadata = await getTokenMetadataByTokenId(TheoryUnlocker, marketItem.tokenId)
    return mapMarketItem(marketItem, metadata)
  }
}

export function mapOwnedTokenIdsAsMarketItems (marketplaceContract, TheoryUnlocker, account) {
  return async (tokenId) => {
    const metadata = await getTokenMetadataByTokenId(TheoryUnlocker, tokenId)
    const approveAddress = await TheoryUnlocker.getApproved(tokenId)
    const hasMarketApproval = approveAddress === marketplaceContract.address
    const [foundMarketItem, hasFound] = await marketplaceContract.getLatestMarketItemByTokenId(tokenId)
    const marketItem = hasFound ? foundMarketItem : {}
    return mapMarketItem(marketItem, metadata, tokenId, account, hasMarketApproval)
  }
}

export function mapMarketItem (marketItem, metadata, tokenId, account, hasMarketApproval) {
	return {
		price: marketItem.price ? ethers.utils.formatUnits(marketItem.price, 'ether') : undefined,
		tokenId: marketItem.tokenId || tokenId,
		marketItemId: marketItem.marketItemId || undefined,
		seller: marketItem.seller || undefined,
		owner: marketItem.owner || account,
		sold: marketItem.sold || false,
		canceled: marketItem.canceled || false,
		animation_url: metadata.animation_url,
		level: metadata.level,
		attributes: metadata.attributes,
		genNumber: marketItem.genNumber,
		hasMarketApproval: hasMarketApproval || false
	};
};

export async function getUniqueOwnedTokenIds (TheoryUnlocker, account) {
	let myNftIds = []
	const OwnedTokenBalance = await TheoryUnlocker.balanceOf(account);
	const balToNum = OwnedTokenBalance.toNumber()

	for (let i = 0; i < balToNum; i++) {
		const tokenId = await TheoryUnlocker.tokenOfOwnerByIndex(account, i);
		myNftIds[i] = tokenId;
	}
	
  return [...new Map(myNftIds.map((item) => [item._hex, item])).values()]
}

// TheoryUnlockerGen1 functions
export async function getTokenMetadataByTokenIdGen1 (TheoryUnlockerGen1, tokenId) {
  try {
    const tokenUri = (await TheoryUnlockerGen1.tokenURI(tokenId)).replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
		const metadata = (await axios(tokenUri)).data;
		await new Promise(r => setTimeout(r, 1000));
		metadata.animation_url = metadata.animation_url.replace("ipfs://", "https://") + ".ipfs.nftstorage.link";
		metadata.level = (await TheoryUnlockerGen1.tokenInfo(tokenId)).level;
    return metadata
  } catch (error) {
    console.log(error)
  }
}

export function mapAvailableMarketItemsGen1 (TheoryUnlockerGen1) {
  return async (marketItem) => {
    const metadata = await getTokenMetadataByTokenIdGen1(TheoryUnlockerGen1, marketItem.tokenId)
    return mapMarketItem(marketItem, metadata)
  }
}

export function mapOwnedTokenIdsAsMarketItemsGen1 (marketplaceContract, TheoryUnlockerGen1, account) {
  return async (tokenId) => {
    const metadata = await getTokenMetadataByTokenIdGen1(TheoryUnlockerGen1, tokenId)
    const approveAddress = await TheoryUnlockerGen1.getApproved(tokenId)
    const hasMarketApproval = approveAddress === marketplaceContract.address
    const [foundMarketItem, hasFound] = await marketplaceContract.getLatestMarketItemByTokenId(tokenId)
    const marketItem = hasFound ? foundMarketItem : {}
    return mapMarketItem(marketItem, metadata, tokenId, account, hasMarketApproval)
  }
}

export async function getUniqueOwnedTokenIdsGen1 (TheoryUnlockerGen1, account) {
	let myNftIds = []
	const OwnedTokenBalance = await TheoryUnlockerGen1.balanceOf(account);
	const balToNum = OwnedTokenBalance.toNumber()

	for (let i = 0; i < balToNum; i++) {
		const tokenId = await TheoryUnlockerGen1.tokenOfOwnerByIndex(account, i);
		myNftIds[i] = tokenId;
	}
	
  return [...new Map(myNftIds.map((item) => [item._hex, item])).values()]
}