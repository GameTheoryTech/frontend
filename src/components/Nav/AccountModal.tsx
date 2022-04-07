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
import useFetchTheoryUnlockers from "../../hooks/useFetchTheoryUnlockers";
import {BigNumber} from "ethers";
import useFetchTheoryUnlockersGen1 from "../../hooks/useFetchTheoryUnlockersGen1";

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const tombFinance = useTombFinance();

  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const gameLocked = useTokenLocked(tombFinance.TOMB);
  const gameCanUnlockAmount = useTokenCanUnlockAmount(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);
  const displayGameLocked = useMemo(() => getDisplayBalance(gameLocked), [gameLocked]);
  const displayGameCanUnlock = useMemo(() => getDisplayBalance(gameCanUnlockAmount), [gameCanUnlockAmount]);

  const theoryUnlockers = useFetchTheoryUnlockers();
  const theoryUnlockersGen1 = useFetchTheoryUnlockersGen1();
  const maxTheoryUnlockerGen0 = theoryUnlockers.length == 0 ? null : theoryUnlockers.reduce((prev, current) => (prev.level > current.level) ? prev : current);
  const maxTheoryUnlockerUnlockAmountGen0 = maxTheoryUnlockerGen0 ? maxTheoryUnlockerGen0.unlockAmount : BigNumber.from(0);
  const maxTheoryUnlockerGen1 = theoryUnlockersGen1.length == 0 ? null : theoryUnlockersGen1.reduce((prev, current) => (prev.level > current.level) ? prev : current);
  const maxTheoryUnlockerUnlockAmountGen1 = maxTheoryUnlockerGen1 ? maxTheoryUnlockerGen1.unlockAmount : BigNumber.from(0);
  const maxTheoryUnlockerIsGen1 = maxTheoryUnlockerUnlockAmountGen1.gt(maxTheoryUnlockerUnlockAmountGen0);
  const maxTheoryUnlocker = maxTheoryUnlockerIsGen1 ? maxTheoryUnlockerGen1 : maxTheoryUnlockerGen1;
  const maxTheoryUnlockerUnlockAmount = maxTheoryUnlockerIsGen1 ? maxTheoryUnlockerUnlockAmountGen1 : maxTheoryUnlockerUnlockAmountGen0;
  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const theoryLocked = useTokenLocked(tombFinance.TSHARE);
  const naturalUnlockAmount = useTokenCanUnlockAmount(tombFinance.TSHARE);
  const theoryCanUnlockAmount = maxTheoryUnlockerUnlockAmount.gt(naturalUnlockAmount) ? maxTheoryUnlockerUnlockAmount : naturalUnlockAmount;
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);
  const displayTheoryLocked = useMemo(() => getDisplayBalance(theoryLocked), [theoryLocked]);
  const displayTheoryCanUnlock = useMemo(() => getDisplayBalance(theoryCanUnlockAmount), [theoryCanUnlockAmount]);

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
            <StyledValue>{`${displayGameLocked} (${displayGameCanUnlock})`}</StyledValue>
            <Label text="LGAME Locked (Available to Unlock)" />
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
            <StyledValue>{`${displayTheoryLocked} (${displayTheoryCanUnlock})`}</StyledValue>
            <Label text="LTHEORY Locked (Available to Unlock)" />
            <Button disabled={theoryCanUnlockAmount.eq(0)} onClick={() => onUnlockTheory(maxTheoryUnlockerIsGen1,maxTheoryUnlocker ? maxTheoryUnlocker.token_id : BigNumber.from(0))} >Unlock</Button>
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
