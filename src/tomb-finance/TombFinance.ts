// import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Fetcher as FetcherSpirit, Token as TokenSpirit, ChainId as ChainIdSpirit } from '@spiritswap/sdk';
import { Fetcher } from '@spookyswap/sdk/dist';
import { Route, Token } from '@spookyswap/sdk/dist';
import { Configuration } from './config';
import {
  ContractName,
  TokenStat,
  AllocationTime,
  LPStat,
  Bank,
  PoolStats,
  TShareSwapperStat,
  AltergeneStat
} from './types';
import {BigNumber, BigNumberish, Contract, ethers, EventFilter} from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { DAI_TICKER, SPOOKY_ROUTER_ADDR, TOMB_TICKER } from '../utils/constants';
import axios from "axios";
import ERC20Lockable from "./ERC20Lockable";
/**
 * An API module of 2omb Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TombFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  masonryVersionOfUser?: string;

  TOMBDAI_LP: Contract;
  TOMBDAI_LPToken: ERC20;
  TSHAREDAI_LPToken: ERC20;
  TOMB: ERC20Lockable;
  TSHARE: ERC20Lockable;
  HODL: ERC20;
  FTM: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.TOMB = new ERC20Lockable(deployments.game.address, provider, 'GAME');
    this.TSHARE = new ERC20Lockable(deployments.theory.address, provider, 'THEORY');
    this.HODL = new ERC20(deployments.hodl.address, provider, 'HODL');
    this.FTM = this.externalTokens['DAI'];

    // Uniswap V2 Pair
    this.TOMBDAI_LP = new Contract(externalTokens['GAME-DAI-LP'][0], IUniswapV2PairABI, provider);
    this.TOMBDAI_LPToken = new ERC20(externalTokens['GAME-DAI-LP'][0], provider, 'GAME-DAI LP');
    this.TSHAREDAI_LPToken = new ERC20(externalTokens['THEORY-DAI-LP'][0], provider, 'THEORY-DAI LP');


    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.TOMB, this.TSHARE, this.HODL, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.TOMBDAI_LP = this.TOMBDAI_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchMasonryVersionOfUser()
      .then((version) => (this.masonryVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch masonry version: ${err.stack}`);
        this.masonryVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getTombStat(): Promise<TokenStat> {
    const { GameGenesisRewardPool } = this.contracts;
    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(GameGenesisRewardPool.address);
    const tombCirculatingSupply = supply
      .sub(tombRewardPoolSupply);
    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.TOMB);
    console.log("price in dai:", priceInFTM)
    const priceOfOneFTM = await this.getDAIPriceFromPancakeswap();
    const priceOfTombInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfTombInDollars,
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('GAME') ? this.TOMB : this.TSHARE;
    const isTomb = name.startsWith('GAME');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const ftmAmountBN = await this.FTM.balanceOf(lpToken.address);
    const ftmAmount = getDisplayBalance(ftmAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const ftmAmountInOneLP = Number(ftmAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isTomb, false);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      ftmAmount: ftmAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  /**
   * Use this method to get price for Tomb
   * @returns TokenStat for HODL
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const tombStat = await this.getTombStat();
    const bondTombRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondTombRatioBN.gt(BigNumber.from(10).pow(18)) ? bondTombRatioBN.div(BigNumber.from(10).pow(18)).toNumber() : 1;
    const bondPriceInFTM = (Number(tombStat.tokenInFtm) * modifier).toFixed(4);
    const priceOfTBondInDollars = (Number(tombStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.HODL.displayedTotalSupply();
    return {
      tokenInFtm: bondPriceInFTM,
      priceInDollars: priceOfTBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for TSHARE
   * priceInFTM
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const { TheoryRewardPool } = this.contracts;

    const supply = await this.TSHARE.totalSupply();

    const priceInFTM = await this.getTokenPriceFromPancakeswap(this.TSHARE);
    const tombRewardPoolSupply = await this.TSHARE.balanceOf(TheoryRewardPool.address);
    const tShareCirculatingSupply = supply.sub(tombRewardPoolSupply);
    const priceOfOneFTM = await this.getDAIPriceFromPancakeswap();
    const priceOfSharesInDollars = (Number(priceInFTM) * Number(priceOfOneFTM)).toFixed(2);

    return {
      tokenInFtm: priceInFTM,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.TSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(tShareCirculatingSupply, this.TSHARE.decimal, 0),
    };
  }

  async getTombStatInNextTWAP(): Promise<TokenStat> {
    const { Treasury, GameGenesisRewardPool } = this.contracts;
    const expectedPrice = await Treasury.getGameUpdatedPrice(); // Updated price is UUUUSELESS.

    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(GameGenesisRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getTombStatInEstimatedTWAP(): Promise<TokenStat> {
    const { Treasury, GameGenesisRewardPool } = this.contracts;
    const expectedPrice = await Treasury.getGamePrice(); // Updated price is UUUUSELESS.

    const supply = await this.TOMB.totalSupply();
    const tombRewardPoolSupply = await this.TOMB.balanceOf(GameGenesisRewardPool.address);
    const tombCirculatingSupply = supply.sub(tombRewardPoolSupply);
    return {
      tokenInFtm: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.TOMB.decimal, 0),
      circulatingSupply: getDisplayBalance(tombCirculatingSupply, this.TOMB.decimal, 0),
    };
  }

  async getNickname(address : string)
  {
    const { Altergene } = this.contracts;
    let nickname = await Altergene.nickname(address);
    if(nickname === "" || !nickname) nickname = address.toString().substr(2,3).toUpperCase();
    return nickname;
  }

  async getAltergeneStat(): Promise<AltergeneStat> {
    const { Altergene } = this.contracts;
    const creditsPurchased = (await Altergene.totalCreditsPurchased()).toString();
    const allHighScores = (await Altergene.allHighScores());
    const allHighScoreWinners = (await Altergene.allHighScoreWinners());
    const allHighScoreNicknames = (await Altergene.allHighScoreNicknames());
    const highScore = allHighScores[0].toString();
    const highScoreList = [...Array<string>(10)];
    for(let i = 0; i < 10; ++i)
    {
      const score = allHighScores[i];
      let nickname = allHighScoreNicknames[i] === "" || !allHighScoreNicknames[i] ? allHighScoreWinners[i].toString().substr(2,3).toUpperCase() : allHighScoreNicknames[i];
      highScoreList[i] = `${score} ${nickname}`
    }

    let highestLevelScore = `${(await Altergene.topAchievements("highestLevelScore"))[1]} by ${await this.getNickname((await Altergene.topAchievements("highestLevelScore"))[0])}`;
    let enemiesDefeated = `${(await Altergene.topAchievements("enemiesDefeated"))[1]} by ${await this.getNickname((await Altergene.topAchievements("enemiesDefeated"))[0])}`;
    let levelReached = `${(await Altergene.topAchievements("levelReached"))[1]} by ${await this.getNickname((await Altergene.topAchievements("levelReached"))[0])}`;
    let powerupsCollected = `${(await Altergene.topAchievements("powerupsCollected"))[1]} by ${await this.getNickname((await Altergene.topAchievements("powerupsCollected"))[0])}`;
    let topSpender = `${(await Altergene.topSpenderAmount())} credit(s) by ${await this.getNickname(await Altergene.topSpenderWinner())}`;
    let dailyEnemiesDefeated = `${(await Altergene.topDailyAchievements("enemiesDefeated"))[1]} by ${await this.getNickname((await Altergene.topDailyAchievements("enemiesDefeated"))[0])}`;

    return {
      creditsPurchased,
      highScore,
      highScoreList,
      highestLevelScore,
      enemiesDefeated,
      levelReached,
      powerupsCollected,
      topSpender,
      dailyEnemiesDefeated
    };
  }

  async getTombPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getGamePrice(); // Updated price is UUUUSELESS.
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBurnableGameLeft();
  }

  /**
   * Calculates the TVL, APR and DPR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    console.log("deposit token price:", depositTokenPrice)
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const stat = bank.earnTokenName === 'GAME' ? await this.getTombStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
      bank.poolId
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    const fee = (bank.earnTokenName === "GAME" ? (await poolContract.depositFee()) :
            (await poolContract.getWithdrawFeeOf(bank.poolId, this.myAccount))) / 100;
    const locked = (bank.earnTokenName === "GAME" ? 0.00 :
        (await poolContract.getCurrentLockPercentage(bank.poolId, this.myAccount)).toNumber());
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
      fee: fee.toFixed(2).toString(),
      locked: locked.toFixed(2).toString()
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
    poolId: number
  ) {
    if (earnTokenName === 'GAME') {
      const rewardPerSecond = await poolContract.getGamePerSecondInPool(poolId);
      return rewardPerSecond;
    }
    const rewardPerSecond = await poolContract.getTheoryPerSecondInPool(poolId);
    return rewardPerSecond
  }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneFtmInDollars = await this.getDAIPriceFromPancakeswap();
    if (tokenName === 'dAI') {
      tokenPrice = priceOfOneFtmInDollars;
    } else if (tokenName === 'DAI') {
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      console.log("token name:", tokenName)
      if (tokenName === 'GAME-DAI LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TOMB, true, false);
      } else if (tokenName === 'THEORY-DAI LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.TSHARE, false, false);
      } else if (tokenName === "2SHARES-DAI LP") {
        tokenPrice = await this.getLPTokenPrice(token, new ERC20("0xc54a1684fd1bef1f077a336e6be4bd9a3096a6ca", this.provider, "2SHARES"), false, true);
      } else if (tokenName === "2OMB-DAI LP") {
        console.log("getting the LP token price here")
        tokenPrice = await this.getLPTokenPrice(token, new ERC20("0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae", this.provider, "2OMB"), true, true);
        console.log("my token price:", tokenPrice)
      } else if (tokenName === 'BLOOM') {
        tokenPrice = await this.getTokenPriceFromSpiritswap(token);
      } else if (tokenName === "BELUGA") {
        const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=beluga-fi&vs_currencies=usd").then(res => res.json())
        tokenPrice = data["beluga-fi"].usd
      } else {
        if(tokenName === "bFTM" || tokenName === "pFTM")
        {
          //Kind of cheating for bonds because we don't consider the premium.
          tokenName = 'pFTM'
          token = new ERC20('0x112dF7E3b4B7Ab424F07319D4E92F41e6608c48B', getDefaultProvider(), 'pFTM', 18);
          tokenPrice = await this.getTokenPriceFromPancakeswapFTMToDAI(token);
          tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
        }
        else if(tokenName !== "GAME" && tokenName !== "THEORY" && tokenName !== "TOMB" && tokenName !== "TSHARE" && tokenName !== "WFTM") {
          tokenPrice = await this.getTokenPriceFromPancakeswapFTMToDAI(token);
          tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
        }
        else {
          tokenPrice = await this.getTokenPriceFromPancakeswap(token);
          tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
        }
      }
    }
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryTombPrice = await Treasury.getGamePrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryTombPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForTomb = await Treasury.getGamePrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForTomb);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      if(!token) continue;
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(this.currentMasonry().address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const masonryMasterToTheoryTvl = await this.contracts.Master.masterToTheory(await this.contracts.Master.totalSupply());
    const dungeonTVL = Number(getDisplayBalance(masonryMasterToTheoryTvl, this.TSHARE.decimal)) * Number(TSHAREPrice);

    return totalValue + masonryTVL + dungeonTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isTomb sanity check for usage of tomb token or tShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isTomb: boolean, isFake: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isFake === true ? isTomb === true ? await this.getTombStatFake() : await this.getShareStatFake() : isTomb === true ? await this.getTombStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async getTombStatFake() {
    const price = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=2omb-finance&vs_currencies=usd").then(res => res.json())
    return { priceInDollars: price["2omb-finance"].usd }
  }

  async getShareStatFake() {
    const price = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=2share&vs_currencies=usd").then(res => res.json())
    return { priceInDollars: price["2share"].usd }
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'GAME') {
        return await pool.pendingGAME(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchMasonryVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentMasonry(): Contract {
    if (!this.masonryVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Theoretics;
  }

  isOldMasonryMember(): boolean {
    return this.masonryVersionOfUser !== 'latest';
  }

  async getTokenPriceFromPancakeswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { DAI, HODL } = this.config.externalTokens;

    const dai = new Token(chainId, DAI[0], DAI[1], "DUMMY", "DUMMY Token");
    const hodl = new Token(chainId, HODL[0], HODL[1], "HODL", "HODL Token");
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    if(dai.address === tokenContract.address) return (1).toFixed(4); //DAI is 1 to 1 with DAI.
    if(hodl.address === tokenContract.address) return (await this.getBondStat()).tokenInFtm;
    try {
      const daiToToken = await Fetcher.fetchPairData(token, dai, this.provider);
      const priceInBUSD = new Route([daiToToken], token);

      return priceInBUSD.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromPancakeswapFTMToDAI(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { DAI, HODL, WFTM } = this.config.externalTokens;

    const dai = new Token(chainId, DAI[0], DAI[1], "DUMMY", "DUMMY Token");
    const hodl = new Token(chainId, HODL[0], HODL[1], "HODL", "HODL Token");
    const wftm = new Token(chainId, WFTM[0], WFTM[1], "DUMMY", "DUMMY Token");
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    if(dai.address === tokenContract.address) return (1).toFixed(4); //DAI is 1 to 1 with DAI.
    if(hodl.address === tokenContract.address) return (await this.getBondStat()).tokenInFtm;
    try {
      const ftmToToken = await Fetcher.fetchPairData(token, wftm, this.provider);
      const daiToFtm = await Fetcher.fetchPairData(wftm, dai, this.provider);
      const priceInBUSD = new Route([ftmToToken, daiToFtm], token);

      return priceInBUSD.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainIdSpirit } = this.config;

    const { DAI } = this.externalTokens;

    const dai = new TokenSpirit(chainIdSpirit, DAI.address, DAI.decimal);
    const token = new TokenSpirit(chainIdSpirit, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    try {
      const daiToToken = await FetcherSpirit.fetchPairData(dai, token, this.provider);
      const liquidityToken = daiToToken.liquidityToken;
      let ftmBalanceInLP = await DAI.balanceOf(liquidityToken.address);
      let ftmAmount = Number(getFullDisplayBalance(ftmBalanceInLP, DAI.decimal));
      let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
      let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
      const priceOfOneFtmInDollars = await this.getDAIPriceFromPancakeswap();
      let priceOfShiba = (ftmAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
      return priceOfShiba.toString();
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getDAIPriceFromPancakeswap(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    try {
      const { data } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dai');
      return (data[0].current_price).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of DAI: ${err}`);
    }
  }

  //===================================================================
  //===================================================================
  //===================== MASONRY METHODS =============================
  //===================================================================
  //===================================================================

  async getMasonryDPR() {
    const Masonry = this.currentMasonry();
    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const lastHistory = await Masonry.theoreticsHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTombStat()).priceInDollars;
    const epochRewardsTotal = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsTotal * Number(TOMBPrice) * 4;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(Masonry.address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL);
    return realAPR;
  }

  async getMasonryAPR() {
    return (await this.getMasonryDPR()) * 365;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    return await Masonry.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Masonry
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromMasonry(): Promise<boolean> {
    const Masonry = this.currentMasonry();
    const canWithdraw = await Masonry.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromMasonry(): Promise<BigNumber> {
    // const Masonry = this.currentMasonry();
    // const mason = await Masonry.masons(this.myAccount);
    return BigNumber.from(0);
  }

  async getTotalTVLInMasonry(): Promise<number> {
    //const Masonry = this.currentMasonry();
    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonrytShareBalanceOf = await this.TSHARE.balanceOf(this.currentMasonry().address);
    const masonryTVL = Number(getDisplayBalance(masonrytShareBalanceOf, this.TSHARE.decimal)) * Number(TSHAREPrice);
    return masonryTVL;
  }

  async getTotalStakedInMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    return await Masonry.totalSupply();
  }

  async stakeShareToMasonry(amount: string): Promise<TransactionResponse> {
    if (this.isOldMasonryMember()) {
      throw new Error("you're using old masonry. please withdraw and deposit the TSHARE again.");
    }
    const Masonry = this.currentMasonry();
    return await Masonry.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getShareOf(this.myAccount);
    }
    return await Masonry.balanceOf(this.myAccount);
  }

  async getEarningsOnMasonry(): Promise<BigNumber> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.getCashEarningsOf(this.myAccount);
    }
    return await Masonry.earned(this.myAccount);
  }

  async withdrawShareFromMasonry(amount: string): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    if (this.masonryVersionOfUser === 'v1') {
      return await Masonry.claimDividends();
    }
    return await Masonry.claimReward();
  }

  async exitFromMasonry(): Promise<TransactionResponse> {
    const Masonry = this.currentMasonry();
    return await Masonry.exit();
  }

  async getDungeonDPR() {
    const { Master } = this.contracts;
    const Masonry = this.currentMasonry();

    const latestSnapshotIndex = await Masonry.latestSnapshotIndex();
    const latestRPS = (await Masonry.theoreticsHistory(latestSnapshotIndex))[2];
    const storedRPS = (await Masonry.theoreticsHistory(latestSnapshotIndex.sub(1)))[2];

    const lastRewardsReceived = (await Masonry.balanceOf(Master.address)).mul(latestRPS.sub(storedRPS)).div(BigNumber.from(10).pow(18));
    //await Master.expectedClaimableGameThisEpoch(); //Broken

    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const TOMBPrice = (await this.getTombStat()).priceInDollars;
    const epochRewardsTotal = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsTotal * Number(TOMBPrice) * 4;
    const masonryMasterToTheoryTvl = await this.contracts.Master.masterToTheory(await this.contracts.Master.totalSupply());
    const dungeonTVL = Number(getDisplayBalance(masonryMasterToTheoryTvl, this.TSHARE.decimal)) * Number(TSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / dungeonTVL);
    return realAPR;
  }

  async getDungeonAPR() {
    return (await this.getDungeonDPR()) * 365;
  }

  async canUserUnstakeFromDungeon(): Promise<boolean> {
    const { Master } = this.contracts;
    const nextTimestamp = (await Master.userInfo(this.myAccount)).lockToTime;
    const toDate = new Date(nextTimestamp * 1000);
    const stakedAmount = await this.getStakedSharesOnDungeon();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.TSHARE.decimal)) === 0;
    const fromDate = new Date(Date.now());
    const result = notStaked ? false : fromDate >= toDate;
    return result;
  }

  async getTotalTVLInDungeon(): Promise<number> {
    //const Masonry = this.currentMasonry();
    const TSHAREPrice = (await this.getShareStat()).priceInDollars;
    const masonryMasterToTheoryTvl = await this.contracts.Master.masterToTheory(await this.contracts.Master.totalSupply());
    const dungeonTVL = Number(getDisplayBalance(masonryMasterToTheoryTvl, this.TSHARE.decimal)) * Number(TSHAREPrice);
    return dungeonTVL;
  }

  async getTotalStakedInDungeon(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.totalSupply();
  }

  async stakeShareToDungeon(amount: string): Promise<TransactionResponse> {
    const { Master } = this.contracts;
    return await Master.buyFromTheory(decimalToBalance(amount), 0);
  }

  async getStakedSharesOnDungeon(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.balanceOf(this.myAccount);
  }

  async getStakedSharesInTheoryOnDungeon(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.masterToTheory(await Master.balanceOf(this.myAccount));
  }

  async getPriceOfMasterInTheory(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.masterToTheory(BigNumber.from(10).pow(18));
  }

  async getPriceOfTheoryInMaster(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.theoryToMaster(BigNumber.from(10).pow(18));
  }

  async getEarningsOnDungeon(): Promise<BigNumber> {
    const { Master } = this.contracts;
    return await Master.earned(this.myAccount);
  }

  async requestWithdrawShareFromDungeon(amount: string): Promise<TransactionResponse> {
    const { Master } = this.contracts;
    return await Master.requestSellToTheory(decimalToBalance(amount), false);
  }

  async withdrawShareFromDungeon(): Promise<TransactionResponse> {
    const { Master } = this.contracts;
    return await Master.sellToTheory();
  }

  async harvestCashFromDungeon(): Promise<TransactionResponse> {
    const { Master } = this.contracts;
    return await Master.claimGame();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Theoretics, Treasury } = this.contracts;
    const nextEpochTimestamp = await Theoretics.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Theoretics.epoch();
    const mason = await Theoretics.theorists(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Theoretics.getCurrentClaimEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the masonry
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Theoretics, Treasury } = this.contracts;
    const nextEpochTimestamp = await Theoretics.nextEpochPoint();
    const currentEpoch = await Theoretics.epoch();
    const mason = await Theoretics.theorists(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Theoretics.getCurrentWithdrawEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnMasonry();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async getUserUnstakeTimeDungeon(): Promise<AllocationTime> {
    const { Master } = this.contracts;
    const nextTimestamp = (await Master.userInfo(this.myAccount)).lockToTime;
    const fromDate = new Date(Date.now());
    const toDate = new Date(nextTimestamp * 1000);
    if (fromDate <= toDate) {
      return { from: fromDate, to: fromDate };
    } else {
      return { from: fromDate, to: toDate };
    }
  }

  // async watchAssetInMetamask(assetName: string): Promise<boolean> {
  //   const { ethereum } = window as any;
  //   if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
  //     let asset;
  //     let assetUrl;
  //     if (assetName === 'TOMB') {
  //       asset = this.TOMB;
  //       assetUrl = 'https://tomb.finance/presskit/tomb_icon_noBG.png';
  //     } else if (assetName === 'TSHARE') {
  //       asset = this.TSHARE;
  //       assetUrl = 'https://tomb.finance/presskit/tshare_icon_noBG.png';
  //     } else if (assetName === 'HODL') {
  //       asset = this.HODL;
  //       assetUrl = 'https://tomb.finance/presskit/tbond_icon_noBG.png';
  //     }
  //     await ethereum.request({
  //       method: 'wallet_watchAsset',
  //       params: {
  //         type: 'ERC20',
  //         options: {
  //           address: asset.address,
  //           symbol: asset.symbol,
  //           decimals: 18,
  //           image: assetUrl,
  //         },
  //       },
  //     });
  //   }
  //   return true;
  // }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.TOMBDAI_LP.getReserves();
    let quote;
    if (tokenName === 'TOMB') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryMasonryFundedFilter = Treasury.filters.MasonryFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let masonryFundEvents = await Treasury.queryFilter(treasuryMasonryFundedFilter);
    var events: any[] = [];
    masonryFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].masonryFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });

    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });
    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === DAI_TICKER) {
      const token = this.FTM;
      estimate = await zapper.estimateZapInToken(
          token.address,
          lpToken.address,
          SPOOKY_ROUTER_ADDR,
          parseUnits(amount, 18),
      );
    } else {
      const token = tokenName === TOMB_TICKER ? this.TOMB : this.TSHARE;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === DAI_TICKER) {
      const token = this.FTM;
      return await zapper.zapInToken(
          token.address,
          parseUnits(amount, 18),
          50,
          lpToken.address,
          SPOOKY_ROUTER_ADDR,
          this.myAccount,
      );
    } else {
      const token = tokenName === TOMB_TICKER ? this.TOMB : this.TSHARE;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        50,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async unlockGame(): Promise<TransactionResponse> {
    const { game, Master } = this.contracts;
    const lockAmount = await game.lockOf(this.myAccount)
    let result : TransactionResponse = null;
    if(lockAmount.lte(await game.canUnlockAmount(this.myAccount)))
    {
      result = await game.unlock();
    }
    if(!result || (await Master.lockOfGame(this.myAccount)).gt(0)) result = await Master.unlockGame();
    return result;
  }

  async lockOfGame(address: string): Promise<BigNumber> {
    const { Master } = this.contracts;
    const result = await Master.lockOfGame(address);
    return result;
  }

  async totalCanUnlockAmountGame(address: string): Promise<BigNumber> {
    const { Master } = this.contracts;
    const result = await Master.totalCanUnlockAmountGame(address);
    return result;
  }

  async unlockTheory(isGen1 : boolean, tokenId : number | BigNumber): Promise<TransactionResponse> {
    const { TheoryUnlocker, TheoryUnlockerGen1, theory } = this.contracts;
    if(BigNumber.from(tokenId).gt(0))
    {
      const lockAmount = await theory.lockOf(this.myAccount)
      if(lockAmount.lte(await theory.canUnlockAmount(this.myAccount)))
      {
        await theory.unlock();
      }
      //Should be called:
      //When lockOf(player) == 0 - Instead of theory.unlock() [disabled on website]
      //When lockOf(player) <= theory.canUnlockAmount(player) - After theory.unlock() [to avoid revert, knew I should have listened to my gut and put a check for the second _unlock]
      //When lockOf(player) > theory.canUnlockAmount(player) - Instead of theory.unlock()
      if(isGen1) return await TheoryUnlockerGen1.nftUnlock(tokenId);
      return await TheoryUnlocker.nftUnlock(tokenId);
    }
    return await theory.unlock();
  }
  async mintTheoryUnlocker(amount: string): Promise<TransactionResponse> {
    const { TheoryUnlocker } = this.contracts;
    return await TheoryUnlocker.mint(BigNumber.from(amount));
  }
  async mergeTheoryUnlocker(tokenId1: string, tokenId2 :string): Promise<TransactionResponse> {
    const { TheoryUnlocker } = this.contracts;
    return await TheoryUnlocker.merge(BigNumber.from(tokenId1), BigNumber.from(tokenId2));
  }
  async getMaxTheoryUnlockerLevel(): Promise<BigNumber> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.maxLevel();
    return result;
  }
  async getTheoryUnlockerOwnerSupply(address: string): Promise<BigNumber> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.balanceOf(address);
    return result;
  }
  async getTheoryUnlockerAtOwnerIndex(address: string, index : number | BigNumber): Promise<BigNumber> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.tokenOfOwnerByIndex(address, index);
    return result;
  }
  async getTheoryUnlockerTokenUri(tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.tokenURI(tokenId);
    return result;
  }
  async getTheoryUnlockerLevel(tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlocker } = this.contracts;
    const result = (await TheoryUnlocker.tokenInfo(tokenId)).level;
    return result;
  }
  async getTheoryUnlockerUnlockAmount(address : string, tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.canUnlockAmount(address, tokenId);
    return result;
  }
  async getTheoryUnlockerTimeLeftToLevel(tokenId : BigNumber | number): Promise<BigNumber> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.timeLeftToLevel(tokenId);
    return result;
  }
  async unlockTheoryWithNFT(tokenId : BigNumber | number): Promise<TransactionResponse> {
    const { TheoryUnlocker } = this.contracts;
    return await TheoryUnlocker.nftUnlock(tokenId);
  }
  async getTheoryUnlockerTotalSupply(): Promise<BigNumber> {
    const { TheoryUnlocker } = this.contracts;
    const result = await TheoryUnlocker.totalSupply();
    return result;
  }
  async levelUpTheoryUnlocker(tokenId : number | BigNumber): Promise<TransactionResponse> {
    const { TheoryUnlocker } = this.contracts;
    return await TheoryUnlocker.levelUp(tokenId);
  }

  async mintTheoryUnlockerGen1(amount: string, slippage : BigNumberish): Promise<TransactionResponse> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return await TheoryUnlockerGen1.mint(BigNumber.from(amount), BigNumber.from(slippage));
  }
  async mergeTheoryUnlockerGen1(tokenId1: string, tokenId2 :string): Promise<TransactionResponse> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return await TheoryUnlockerGen1.merge(BigNumber.from(tokenId1), BigNumber.from(tokenId2));
  }
  async getMaxTheoryUnlockerGen1Level(): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.maxLevel();
    return result;
  }
  async getTheoryUnlockerGen1OwnerSupply(address: string): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.balanceOf(address);
    return result;
  }
  async getTheoryUnlockerGen1AtOwnerIndex(address: string, index : number | BigNumber): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.tokenOfOwnerByIndex(address, index);
    return result;
  }
  async getTheoryUnlockerGen1TokenUri(tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.tokenURI(tokenId);
    return result;
  }
  async getTheoryUnlockerGen1Level(tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = (await TheoryUnlockerGen1.tokenInfo(tokenId)).level;
    return result;
  }
  async getTheoryUnlockerGen1UnlockAmount(address : string, tokenId : BigNumber | number): Promise<string> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.canUnlockAmount(address, tokenId);
    return result;
  }
  async getTheoryUnlockerGen1TimeLeftToLevel(tokenId : BigNumber | number): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.timeLeftToLevel(tokenId);
    return result;
  }
  async getTheoryUnlockerGen1TimeToLevel(): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.timeToLevel();
    return result;
  }
  async unlockTheoryWithNFTGen1(tokenId : BigNumber | number): Promise<TransactionResponse> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return await TheoryUnlockerGen1.nftUnlock(tokenId);
  }
  async getTheoryUnlockerGen1TotalMinted(level : BigNumberish): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.minted(BigNumber.from(level));
    return result;
  }
  async getTheoryUnlockerGen1Supply(level : BigNumberish): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.supply(BigNumber.from(level));
    return result;
  }
  async getTheoryUnlockerGen1MaxMinted(level : BigNumberish): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const result = await TheoryUnlockerGen1.maxMinted(BigNumber.from(level));
    return result;
  }
  async levelUpTheoryUnlockerGen1(tokenId : number | BigNumber): Promise<TransactionResponse> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return await TheoryUnlockerGen1.levelUp(tokenId);
  }
  async levelUpToTheoryUnlockerGen1(tokenId : number | BigNumber, level : number | BigNumber): Promise<TransactionResponse> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return await TheoryUnlockerGen1.levelUpTo(tokenId, level);
  }
  async getTheoryUnlockerGen1Merged(tokenId : BigNumber | number): Promise<boolean> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return (await TheoryUnlockerGen1.tokenInfo(tokenId)).merged;
  }
  async getTheoryUnlockerGen1LastLevelTime(tokenId : BigNumber | number): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    return (await TheoryUnlockerGen1.tokenInfo(tokenId)).lastLevelTime;
  }
  async getTheoryUnlockerGen1LevelUpCost(level : BigNumberish): Promise<BigNumber> {
    const { TheoryUnlockerGen1 } = this.contracts;
    const base = (await TheoryUnlockerGen1.gameCostPerLevel()).mul(BigNumber.from(level));
    const extra = await TheoryUnlockerGen1.extraGameCost(BigNumber.from(level));
    const result = base.add(extra);
    return result;
  }

  async swapTBondToTShare(tbondAmount: BigNumber): Promise<TransactionResponse> {
    const { TShareSwapper } = this.contracts;
    return await TShareSwapper.swapTBondToTShare(tbondAmount);
  }
  async estimateAmountOfTShare(tbondAmount: string): Promise<string> {
    const { TShareSwapper } = this.contracts;
    try {
      const estimateBN = await TShareSwapper.estimateAmountOfTShare(parseUnits(tbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate tshare amount: ${err}`);
    }
  }

  async getTShareSwapperStat(address: string): Promise<TShareSwapperStat> {
    const { TShareSwapper } = this.contracts;
    const tshareBalanceBN = await TShareSwapper.getTShareBalance();
    const tbondBalanceBN = await TShareSwapper.getTBondBalance(address);
    // const tombPriceBN = await TShareSwapper.getTombPrice();
    // const tsharePriceBN = await TShareSwapper.getTSharePrice();
    const rateTSharePerTombBN = await TShareSwapper.getTShareAmountPerTomb();
    const tshareBalance = getDisplayBalance(tshareBalanceBN, 18, 5);
    const tbondBalance = getDisplayBalance(tbondBalanceBN, 18, 5);
    return {
      tshareBalance: tshareBalance.toString(),
      tbondBalance: tbondBalance.toString(),
      // tombPrice: tombPriceBN.toString(),
      // tsharePrice: tsharePriceBN.toString(),
      rateTSharePerTomb: rateTSharePerTombBN.toString(),
    };
  }
}
