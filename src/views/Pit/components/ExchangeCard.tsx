import React from 'react';

import { Box, Grid, Button, Card, CardContent, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import useTombFinance from '../../../hooks/useTombFinance';
import TokenSymbol from '../../../components/TokenSymbol';
import useModal from '../../../hooks/useModal';
import ExchangeModal from './ExchangeModal';
import ERC20 from '../../../tomb-finance/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';
import {BigNumber} from "ethers";
import { makeStyles } from '@mui/styles';

import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';

interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
  max?: BigNumber;
}

const useStyles = makeStyles((theme) => ({
  button : {
    width: '2em',
    height: '2em',
    fontSize: '14px',
    padding: '0',
    minWidth: 'auto'
  },
  boxed : {
    '& > *': {
      position: 'relative',
      height: 'calc(100% - 60px)',
      display: 'flex',
      flexDirection: 'column',
      '& .buttonWrap': {
        marginTop: 'auto'
      }
    },
  }
}));

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
  max = undefined
}) => {
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useTombFinance();
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);
  const balance = useTokenBalance(fromToken);
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={max == undefined ? balance : (balance.gt(max) ? max : balance)}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );

  const classes = useStyles();

  const handleRewardsClose = () => {
    onCloseRewards();
  };

  const [onHandleRewards, onCloseRewards] = useModal(
    <Modal text={action === 'Purchase' ? 'Purchase HODL' : 'Reedem GAME'} onDismiss={handleRewardsClose}>
      <Typography variant="h6" color="#fff" style={{fontWeight: '500'}}>
        {action === 'Purchase' ? (
          <>
            When the TWAP of GAME tokens is under $1.01, you can exchange GAME tokens for HODL tokens. The GAME tokens exchanged are then burned, thereby reducing the supply.<br /><br />

            <strong>TWAP</strong><br />Time-Weighted Average Price of GAME during the course of the previous Round.
            </>
        ) : (
          <>
            When the TWAP of GAME tokens is above 1.1, you can redeem your HODL tokens for GAME tokens at a premium. When above 1.01 but below 1.1, you can redeem them, but not at a premium.<br /><br />

            <strong>TWAP</strong><br />Time-Weighted Average Price of GAME during the course of the previous Round.
          </>
        )}
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleRewardsClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );

  return (
    <Card className={classes.boxed}>
      <CardContent>

        <Typography variant='h4' className="kallisto" style={{marginBottom: '20px'}}>
          {action} {toTokenName}
          <Button variant="contained" className={classes.button} aria-label="More info" style={{ marginLeft: '10px' }} onClick={onHandleRewards}>
            <QuestionMarkIcon fontSize='inherit' />
          </Button>
        </Typography>

        <Grid container justifyContent="center" spacing={3} alignItems="center" style={{marginBottom: '50px'}}>
          <Grid item xs={'auto'} style={{textAlign: 'center'}}>
            <Box>
              <TokenSymbol symbol={fromToken.symbol} />
              <Typography variant='body1' component="p" style={{marginTop: '10px'}}>{fromTokenName}</Typography>
            </Box>
          </Grid>

          <Grid item xs={'auto'} style={{textAlign: 'center'}}>
            <ArrowForwardRoundedIcon className="pinkGlow" style={{fontSize: '34px'}} />
          </Grid>

          <Grid item xs={'auto'} style={{textAlign: 'center'}}>
            <TokenSymbol symbol={toToken.symbol} />
            <Typography variant='body1' component="p" style={{marginTop: '10px'}}>{toTokenName}</Typography>
          </Grid>
        </Grid>

        <Box className="buttonWrap">

          <Typography variant='body2' style={{marginBottom: '20px'}}>
            {priceDesc}
          </Typography>

          {approveStatus !== ApprovalState.APPROVED && !disabled ? (
              <Button
                color="primary"
                variant="contained"
                disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
                onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
              >
                {`Approve ${fromTokenName}`}
              </Button>
            ) : (
              <Button color="primary" variant="contained" onClick={onPresent} disabled={disabled}>
                {disabledDescription || action}
              </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExchangeCard;
