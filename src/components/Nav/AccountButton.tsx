import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useWallet } from 'use-wallet';
import useModal from '../../hooks/useModal';
import WalletProviderModal from '../WalletProviderModal';
import AccountModal from './AccountModal';
import { makeStyles, useTheme } from '@mui/styles';
import AccountBalanceWalletIcon from '../../assets/img/wallet-icon.svg';

interface AccountButtonProps {
  text?: string;
}

const useStyles = makeStyles((theme : any) => ({
  button: {
    fontSize: '14px',
    '& span': {
      marginLeft: '10px',
    },
    '@media (max-width: 767px)': {
      '& span': {
        display: 'none',
      },
      padding: '10px 0',
    }
  }
}));

const AccountButton: React.FC<AccountButtonProps> = ({ text }) => {
  const { account } = useWallet();
  const [onPresentAccountModal] = useModal(<AccountModal />);

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />);

  const buttonText = text ? text : 'Unlock';
  const theme = useTheme() as any;
  const classes = useStyles(theme);

  return (
    <div>
      {!account ? (
        <Button onClick={onPresentWalletProviderModal} className={classes.button} color="primary" variant="contained" size="small">
          <img src={AccountBalanceWalletIcon} style={{position: 'relative',top: '-2.5px',height: '24px'}} /><span>{buttonText}</span>
        </Button>
      ) : (
        <Button variant="contained" className={classes.button} onClick={onPresentAccountModal} size="small">
          <img src={AccountBalanceWalletIcon} style={{position: 'relative',top: '-2.5px',height: '24px'}} /><span>My Wallet</span>
        </Button>
      )}

      {/*<WalletProviderModal open={isWalletProviderOpen} handleClose={handleWalletProviderClose} />*/}
      {/* <AccountModal open={isAccountModalOpen} handleClose={handleAccountModalClose}/> */}
    </div>
  );
};

export default AccountButton;
