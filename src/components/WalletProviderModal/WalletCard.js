import React from 'react';
import { Button } from '@mui/material';

const WalletCard = ({ icon, onConnect, title }) => (
  <Button fullWidth variant="outlined" onClick={onConnect} className="wallet-button">
    <span style={{ marginRight: '1rem', height: '2rem' }}>{icon}</span>
    <span>{title}</span>
  </Button>
);

export default WalletCard;