// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@spookyswap/sdk/dist';
import { ChainId as ChainIdSpirit } from '@spiritswap/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.MAINNET,
    chainIdSpirit: ChainIdSpirit.MAINNET,
    networkName: 'Fantom Opera Mainnet',
    ftmscanUrl: 'https://ftmscan.com',
    defaultProvider: 'https://rpc.ftm.tools',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
      'GAME': ['0x56EbFC2F3873853d799C155AF9bE9Cb8506b7817', 18],
      'THEORY': ['0x60787C689ddc6edfc84FCC9E7d6BD21990793f06', 18],
      'HODL': ['0xFfF54fcdFc0E4357be9577D8BC2B4579ce9D5C88', 18],
      'DAI': ['0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18],
      'GAME-DAI LP': ['0x168e509FE5aae456cDcAC39bEb6Fd56B6cb8912e', 18],
      'THEORY-DAI LP': ['0xF69FCB51A13D4Ca8A58d5a8D964e7ae5d9Ca8594', 18],
      'GAME-DAI-LP': ['0x168e509FE5aae456cDcAC39bEb6Fd56B6cb8912e', 18],
      'THEORY-DAI-LP': ['0xF69FCB51A13D4Ca8A58d5a8D964e7ae5d9Ca8594', 18],
      'USDC': ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      'MIM': ['0x82f0B8B456c1A451378467398982d4834b6829c1', 18],
      'WFTM': ['0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18],
      'ETH': ['0x74b23882a30290451A17c44f4F05243b6b58C76d', 18],
      'pFTM': ['0x112dF7E3b4B7Ab424F07319D4E92F41e6608c48B', 18],
      'bFTM': ['0x43fF4d2d89dDB6A5B2932a048E18d125b3606565', 18],
    },
    baseLaunchDate: new Date('2021-06-02T13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
  development: {
    chainId: ChainId.FTMTESTNET,
    chainIdSpirit: ChainIdSpirit.FTMTESTNET,
    networkName: 'Fantom Opera Testnet',
    ftmscanUrl: 'https://testnet.ftmscan.com',
    defaultProvider: 'https://xapi.testnet.fantom.network/lachesis',
    deployments: require('./tomb-finance/deployments/deployments.testing.json'),
    externalTokens: {
      'GAME': ['0x9b343B2fF740E7d4935a4C26c8f94DaD73b5f2ad', 18],
      'THEORY': ['0x330e5d339C84524B99a02Df30c086b01fcE41614', 18],
      'DAI': ['0xCc8FF4E67B368797d0Bc16cae2D0E6a25d716F37', 18],
      'GAME-DAI LP': ['0xC3B9aD492016feBacbF23EC67183Ec0114341d56', 18],
      'THEORY-DAI LP': ['0x91CfC045020dbAC619b5245eF5d9e7427A9eC262', 18],
      'GAME-DAI-LP': ['0xC3B9aD492016feBacbF23EC67183Ec0114341d56', 18],
      'THEORY-DAI-LP': ['0x91CfC045020dbAC619b5245eF5d9e7427A9eC262', 18],
    },
    baseLaunchDate: new Date('2021-06-02T13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  GameDAIRewardPool: {
    name: 'Earn GAME by staking DAI',
    page: "GameDAIRewardPool",
    poolId: 0,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'DAI',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '7500',
    site: "https://makerdao.com",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    sort: 0,
    closedForStaking: true,
  },
  GameUSDCRewardPool: {
    name: 'Earn GAME by staking USDC',
    page: "GameUSDCRewardPool",
    poolId: 1,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '2500',
    site: "https://www.centre.io",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    sort: 1,
    closedForStaking: true,
  },
  GameMIMRewardPool: {
    name: 'Earn GAME by staking MIM',
    page: "GameMIMRewardPool",
    poolId: 2,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'MIM',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '2500',
    site: "https://abracadabra.money",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x82f0B8B456c1A451378467398982d4834b6829c1',
    sort: 2,
    closedForStaking: true,
  },
  GameWFTMRewardPool: {
    name: 'Earn GAME by staking WFTM',
    page: "GameWFTMRewardPool",
    poolId: 6, // Hardhat sucks at deploying to mainnet Fantom, it failed the transaction and skipped WFTM and I had to add it manually so the pools are now out of order.
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'WFTM',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '2500',
    site: "https://fantom.foundation/defi",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    sort: 3,
    closedForStaking: true,
  },
  GameETHRewardPool: {
    name: 'Earn GAME by staking ETH (wETH on SpookySwap)',
    page: "GameETHRewardPool",
    poolId: 3,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'ETH',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '2500',
    site: "https://weth.io",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x74b23882a30290451A17c44f4F05243b6b58C76d',
    sort: 4,
    closedForStaking: true,
  },
  GamepFTMRewardPool: {
    name: 'Earn GAME by staking pFTM',
    page: "GamepFTMRewardPool",
    poolId: 4,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'pFTM',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '4000',
    site: "https://ripae.finance",
    buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x112dF7E3b4B7Ab424F07319D4E92F41e6608c48B',
    sort: 5,
    closedForStaking: true,
  },
  GamebFTMRewardPool: {
    name: 'Earn GAME by staking bFTM',
    page: "GamebFTMRewardPool",
    poolId: 5,
    sectionInUI: 0,
    contract: 'GameGenesisRewardPool',
    depositTokenName: 'bFTM',
    earnTokenName: 'GAME',
    finished: false,
    multiplier: '5000',
    site: "https://ripae.finance",
    buyLink: 'https://ripae.finance/bonds',
    sort: 6,
    closedForStaking: true,
  },
  TheoryGameDaiSpookyLpRewardPool: {
    name: 'Earn THEORY by staking GAME-DAI LP',
    page: "TheoryGameDaiSpookyLpRewardPool",
    poolId: 0,
    sectionInUI: 2,
    contract: 'TheoryRewardPool',
    depositTokenName: 'GAME-DAI LP',
    earnTokenName: 'THEORY',
    finished: false,
    multiplier: '35500',
    site: "https://gametheory.tech",
    buyLink: 'https://spookyswap.finance/add/0x56EbFC2F3873853d799C155AF9bE9Cb8506b7817/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    sort: 0,
    closedForStaking: false,
  },
  TheoryTheoryDaiSpookyLpRewardPool: {
    name: 'Earn THEORY by staking THEORY-DAI LP',
    page: "TheoryTheoryDaiSpookyLpRewardPool",
    poolId: 1,
    sectionInUI: 2,
    contract: 'TheoryRewardPool',
    depositTokenName: 'THEORY-DAI LP',
    earnTokenName: 'THEORY',
    finished: false,
    multiplier: '24000',
    site: "https://gametheory.tech",
    buyLink: 'https://spookyswap.finance/add/0x60787C689ddc6edfc84FCC9E7d6BD21990793f06/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    sort: 1,
    closedForStaking: false,
  }
};

export default configurations['production'];
