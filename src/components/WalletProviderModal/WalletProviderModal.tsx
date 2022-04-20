import React from 'react';
import WalletCard from './WalletCard';
import metamaskLogo from '../../assets/img/metamask-fox.svg';
import walletConnectLogo from '../../assets/img/wallet-connect.svg';
import { useWallet } from 'use-wallet';
import Modal, { ModalProps } from '../Modal';

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, connect } = useWallet();

  return (
    <Modal text="Connect Wallet" onDismiss={onDismiss}>
          <WalletCard
            icon={<img src={metamaskLogo} alt="Metamask logo" style={{ height: 32 }} />}
            onConnect={() => {
              connect('injected');
              onDismiss();
            }}
            title="Metamask"
          />
          <WalletCard
            icon={<img src={walletConnectLogo} alt="Wallet Connect logo" style={{ height: 24 }} />}
            onConnect={() => {
              connect('walletconnect');
              onDismiss();
            }}
            title="WalletConnect"
          />
          {/* <WalletCard
            icon={<img src={coingBaseLogo} alt="Coinbase wallet logo" style={{ height: 32 }} />}
            onConnect={() => {
              connect('walletlink');
            }}
            title="Coinbase Wallet"
          /> */}
    </Modal>
  );
};

export default WalletProviderModal;
