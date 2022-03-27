import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import useTokenLocked from '../../hooks/useTokenLocked';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useTombFinance from '../../hooks/useTombFinance';
import TokenSymbol from '../TokenSymbol';
import {makeStyles} from "@mui/styles";
import Button from "../Button";
import useTokenCanUnlockAmount from "../../hooks/useTokenCanUnlockAmount";
import useZap from "../../hooks/useZap";
import useUnlockGame from "../../hooks/useUnlockGame";
import useUnlockTheory from "../../hooks/useUnlockTheory";

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const tombFinance = useTombFinance();

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const gameLocked = useTokenLocked(tombFinance.TOMB);
  const gameCanUnlockAmount = useTokenCanUnlockAmount(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);
  const displayGameLocked = useMemo(() => getDisplayBalance(gameLocked), [gameLocked]);

  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const theoryLocked = useTokenLocked(tombFinance.TSHARE);
  const theoryCanUnlockAmount = useTokenCanUnlockAmount(tombFinance.TSHARE);
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);
  const displayTheoryLocked = useMemo(() => getDisplayBalance(theoryLocked), [theoryLocked]);

  const tbondBalance = useTokenBalance(tombFinance.HODL);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);

  const { onUnlockGame } = useUnlockGame();
  const { onUnlockTheory } = useUnlockTheory();

  // const useStyles = makeStyles((theme) => ({
  //   modalContent: {
  //     backgroundColor: "darkred"
  //   }
  // }));
  //
  // const classes = useStyles();
  //
  // const modalProps = { // make sure all required component's inputs/Props keys&types match
  //   className: classes.modalContent
  // }

  return (
    <Modal>
      <ModalTitle text="My Wallet" />

      <Balances>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="TOMB" />
          <StyledBalance>
            <StyledValue>{displayTombBalance}</StyledValue>
            <Label text="GAME Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="TOMB" />
          <StyledBalance>
            <StyledValue>{displayGameLocked}</StyledValue>
            <Label text="GAME Locked" />
            <Button disabled={gameCanUnlockAmount.eq(0)} onClick={onUnlockGame}>Unlock</Button> {/*Can only unlock after a year, so don't have to implement this immediately.*/}
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="TSHARE" />
          <StyledBalance>
            <StyledValue>{displayTshareBalance}</StyledValue>
            <Label text="THEORY Available" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="TSHARE" />
          <StyledBalance>
            <StyledValue>{displayTheoryLocked}</StyledValue>
            <Label text="THEORY Locked" /> {/*TODO: Link to unlock*/}
            <Button disabled={theoryCanUnlockAmount.eq(0)} onClick={onUnlockTheory} >Unlock</Button> {/*Can only unlock after a year, so don't have to implement this immediately.*/}
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="HODL" />
          <StyledBalance>
            <StyledValue>{displayTbondBalance}</StyledValue>
            <Label text="HODL Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>
  );
};

const StyledValue = styled.div`
  color: ${(props) => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${(props) => props.theme.spacing[3]}px;
`;

export default AccountModal;
