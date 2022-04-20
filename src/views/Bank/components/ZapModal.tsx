import React, { useState, useMemo } from 'react';

import { Button, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import { withStyles } from '@mui/styles'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInput from '../../../components/TokenInput';
import styled from 'styled-components';

import { getDisplayBalance } from '../../../utils/formatBalance';
import Label from '../../../components/Label';
import useLpStats from '../../../hooks/useLpStats';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTombFinance from '../../../hooks/useTombFinance';
import { useWallet } from 'use-wallet';
import useApproveZapper, { ApprovalState } from '../../../hooks/useApproveZapper';
import { TOMB_TICKER, TSHARE_TICKER, DAI_TICKER } from '../../../utils/constants';
import { Alert } from '@mui/lab';
import useRefresh from "../../../hooks/useRefresh";

interface ZapProps extends ModalProps {
  onConfirm: (zapAsset: string, lpName: string, amount: string) => void;
  tokenName?: string;
  decimals?: number;
}

// create function for string convert to 4 decimal places
const convertTo4Decimals = (amount: Number) => {
  return amount.toFixed(4);
}

const ZapModal: React.FC<ZapProps> = ({ onConfirm, onDismiss, tokenName = '', decimals = 18 }) => {
  const tombFinance = useTombFinance();
  const balance = useTokenBalance(tombFinance?.FTM);
  const ftmBalance = getDisplayBalance(balance);
  const tombBalance = useTokenBalance(tombFinance?.TOMB);
  const tshareBalance = useTokenBalance(tombFinance?.TSHARE);
  const [val, setVal] = useState('');
  const [zappingToken, setZappingToken] = useState(DAI_TICKER);
  const [zappingTokenBalance, setZappingTokenBalance] = useState(ftmBalance);
  const [estimate, setEstimate] = useState({ token0: '0', token1: '0' }); // token0 will always be FTM in this case
  const [approveZapperStatus, approveZapper] = useApproveZapper(zappingToken);
  const tombFtmLpStats = useLpStats('GAME-DAI-LP');
  const tShareFtmLpStats = useLpStats('THEORY-DAI-LP');
  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const ftmAmountPerLP = tokenName.startsWith(TOMB_TICKER) ? tombLPStats?.ftmAmount : tshareLPStats?.ftmAmount;
  if(zappingToken === DAI_TICKER && zappingTokenBalance !== ftmBalance) setZappingTokenBalance(ftmBalance);
  /**
   * Checks if a value is a valid number or not
   * @param n is the value to be evaluated for a number
   * @returns
   */
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  const handleChangeAsset = (event: any) => {
    const value = event.target.value;
    setZappingToken(value);
    setZappingTokenBalance(ftmBalance);
    if (event.target.value === TSHARE_TICKER) {
      setZappingTokenBalance(getDisplayBalance(tshareBalance, decimals));
    }
    if (event.target.value === TOMB_TICKER) {
      setZappingTokenBalance(getDisplayBalance(tombBalance, decimals));
    }
  };

  const handleChange = async (e: any) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setVal(e.currentTarget.value);
      setEstimate({ token0: '0', token1: '0' });
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setVal(e.currentTarget.value);
    const estimateZap = await tombFinance?.estimateZapIn(zappingToken, tokenName, String(e.currentTarget.value));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  const handleSelectMax = async () => {
    setVal(zappingTokenBalance);
    const estimateZap = await tombFinance?.estimateZapIn(zappingToken, tokenName, String(zappingTokenBalance));
    setEstimate({ token0: estimateZap[0].toString(), token1: estimateZap[1].toString() });
  };

  return (
    <Modal text={`Create ${tokenName} Tokens`} onDismiss={onDismiss}>

      <InputLabel id="label" style={{textAlign: 'center'}} className="textGlow">
        Select asset to use
      </InputLabel>
      <Select
        onChange={handleChangeAsset}
        labelId="label"
        id="select"
        value={zappingToken}
        style={{marginBottom: '20px'}}
      >
        <MenuItem value={TOMB_TICKER}>GAME</MenuItem>
        <MenuItem value={DAI_TICKER}>DAI</MenuItem>
        <MenuItem value={TSHARE_TICKER}>THEORY</MenuItem>
      </Select>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={zappingTokenBalance}
        symbol={zappingToken}
      />
      <Typography variant="h5" style={{textAlign: 'center', marginTop: '20px', marginBottom: '10px'}}>
        Estimated {tokenName} tokens
      </Typography>
      <Typography variant="h3" color="var(--extra-color-2)" align='center'>
        {' '}
        {convertTo4Decimals(Number(estimate.token0) / Number(ftmAmountPerLP))}
      </Typography>
      <Typography variant="body1" className="textGlow" align="center">
        {' '}
        ({Number(estimate.token0).toFixed(4)} {DAI_TICKER} / {Number(estimate.token1).toFixed(4)}{' '}
        {tokenName.startsWith(TOMB_TICKER) ? TOMB_TICKER : TSHARE_TICKER}){' '}
      </Typography>
      <ModalActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            approveZapperStatus !== ApprovalState.APPROVED ? approveZapper() : onConfirm(zappingToken, tokenName, val)
          }
        >
          {approveZapperStatus !== ApprovalState.APPROVED ? 'Approve' : "Let's go"}
        </Button>
      </ModalActions>

      <Typography variant='h4' component="p" style={{textAlign: 'center', marginTop: '40px', marginBottom: '20px'}}>
        After creating tokens,<br />deposit them in the liquidity pool.
      </Typography>
      <Typography variant='body1' className="textGlow" style={{textAlign: 'center'}}>
        Zapping incurs a 0.5% convenience fee and 0.5% slippage.<br />Beta feature. Use at your own risk!
      </Typography>
    </Modal>
  );
};

export default ZapModal;
