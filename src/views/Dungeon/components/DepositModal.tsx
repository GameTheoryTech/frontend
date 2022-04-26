import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography } from '@mui/material';
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import TokenInputTheoryToMaster from '../../../components/TokenInputTheoryToMaster';

import {getDisplayBalance, getFullDisplayBalance} from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import usePriceOfMasterInTheory from "../../../hooks/usePriceOfMasterInTheory";

interface DepositModalProps extends ModalProps {
    max: BigNumber;
    onConfirm: (amount: string) => void;
    tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' }) => {
    const [val, setVal] = useState('');

    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(max, tokenName === 'USDC' ? 6 : 18);
    }, [max, tokenName]);

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setVal(e.currentTarget.value);
        },
        [setVal],
    );

    const handleSelectMax = useCallback(() => {
        setVal(fullBalance);
    }, [fullBalance, setVal]);

    const price = Number(getDisplayBalance(usePriceOfMasterInTheory()));

    return (
        <Modal text={`Deposit ${tokenName}`} onDismiss={onDismiss}>
            <TokenInputTheoryToMaster
                value={val}
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullBalance}
                symbol={tokenName}
                price={price}
            />
            <ModalActions>
                <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
                    Confirm
                </Button>
            </ModalActions>
            <Typography variant="body2" className="textGlow" align="center" style={{marginTop: '40px'}}>
                Lock Time: 1 year (365 days)
            </Typography>
        </Modal>
    );
};

export default DepositModal;