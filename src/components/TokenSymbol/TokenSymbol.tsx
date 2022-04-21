import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/GAME.png';
import tShareLogo from '../../assets/img/THEORY.png';
import tombLogoPNG from '../../assets/img/GAME.png';
import tShareLogoPNG from '../../assets/img/THEORY.png';
import tBondLogo from '../../assets/img/HODL.png';
import masterLogo from '../../assets/img/MASTER.png';

import tombFtmLpLogo from '../../assets/img/tomb_ftm_lp.png';
import tshareFtmLpLogo from '../../assets/img/tshare_ftm_lp.png';

import daiLogo from '../../assets/img/DAI.png';
import ftmLogo from '../../assets/img/fantom-ftm-logo.png';
import ethLogo from '../../assets/img/ethereum-eth.png';
import pFTMLogo from '../../assets/img/ripae_pftm.png';
import bFTMLogo from '../../assets/img/ripae_bftm.png';
import usdcLogo from '../../assets/img/USDC.png';
import booLogo from '../../assets/img/spooky.png';
import belugaLogo from '../../assets/img/BELUGA.png';
import twoshareLogo from '../../assets/img/t_2SHARE-01.png';
import twoombLogo from '../../assets/img/t_2OMB-01.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';
import bifiLogo from '../../assets/img/COW.svg';
import mimLogo from '../../assets/img/mimlogopng.png';
import bloomLogo from '../../assets/img/BLOOM.jpg';

import GameLPLogo from '../../assets/img/GAME-DAI.png';
import TheoryLPLogo from '../../assets/img/THEORY-DAI.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  GAME: tombLogo,
  TOMBPNG: tombLogoPNG,
  GAMEPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  TSHARE: tShareLogo,
  THEORY: tShareLogo,
  THEORYPNG: tShareLogoPNG,
  HODL: tBondLogo,
  MASTER: masterLogo,
  DAI: daiLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  BELUGA: belugaLogo,
  BIFI: bifiLogo,
  MIM: mimLogo,
  BLOOM: bloomLogo,

  'GAME-DAI LP': GameLPLogo,
  'THEORY-DAI LP': TheoryLPLogo,


  'dAI': daiLogo,
  'FTM': ftmLogo,
  'WFTM': ftmLogo,
  'USDC': usdcLogo,
  'ETH': ethLogo,
  'pFTM': pFTMLogo,
  'bFTM': bFTMLogo,
  '2OMB': twoombLogo,
  '2SHARES': twoshareLogo,
  'GAME-DAI-LP': tombFtmLpLogo,
  'THEORY-DAI-LP': tshareFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    return <img src={logosBySymbol['TOMB']} alt={`${symbol} Logo`} width={size} height={size} style={{display: 'block',borderRadius: '100%',boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />
    // throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} style={{display: 'block', borderRadius: '100%', boxShadow: "0px 0px 20px 0px var(--extra-color-1)",}} />;
};

export default TokenSymbol;
