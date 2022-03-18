import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Typography, Grid } from '@mui/material';

import TokenSymbol from '../../components/TokenSymbol';

const CemeteryCard = ({ bank }) => {
  return (
    <Grid item xs={12} md={4} lg={4}>
      <Card variant="outlined" style={{ border: '1px solid var(--white)' }}>
        <CardContent>
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                right: '0px',
                top: '-5px',
                height: '48px',
                width: '48px',
                borderRadius: '40px',
                backgroundColor: 'transparent',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TokenSymbol size={32} symbol={bank.depositTokenName} />
            </Box>
            <Typography variant="h5" component="h2">
              {bank.depositTokenName}
            </Typography>
            <Typography color="textSecondary">
              {/* {bank.name} */}
              Deposit {bank.depositTokenName} and Earn {` ${bank.earnTokenName}`}
            </Typography>
            <Typography color="textSecondary">
              Allocation: {bank.multiplier}
            </Typography>
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
        <Button color="primary" size="small" variant="contained" target="_blank" href={`${bank.site}`}>
          ↗
        </Button>
        <Button color="primary" size="small" variant="contained" target="_blank" href={`${bank.buyLink}`}>
            Buy
          </Button>
          <Button color="primary" size="small" variant="contained" component={Link} to={`/farms/${bank.page}`}>
            Stake
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CemeteryCard;
