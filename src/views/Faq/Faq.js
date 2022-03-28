import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';

import { Box, Grid, Paper } from '@mui/material';

import { makeStyles } from '@mui/styles';

const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
}

* {
    border-radius: 0 !important;
}
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Faq = () => {

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper style={{ backgroundColor: "transparent", boxShadow: "none", border: "1px solid var(--white)" }}>
            <Box p={4}>
              <h2>FAQ</h2>
              <h3>Are you affiliated with Ripae?</h3>
              <p>No, but we enjoy their community and what they're building!</p>
              <h3>Will you renounce the contracts?</h3>
              <p>As the project is a mixture of a RPG game, a seigniorage protocol, and a blockchain game, the code is complicated and our team needs to have access to the contract. In lieu of renouncement, our team will have a multi-signature wallet as well as has edited the contract to make it more secure. For more info, please see the docs. </p>
              <h3>Will you undergo KYC?</h3>
              <p>As we have seen before, countless projects have scammed investors after a KYC. We do not believe that a KYC provides any extra security for investors, and believe trust in us will come through time and demonstrating to investors that Game Theory will outwork and outperform our competitors.</p>
              <h3>Will Game Theory be audited?</h3>
              <p>Yes.</p>
              <h3>Why DAI?</h3>
              <p>For its stability, simplicity, and for the fact that it is not used too much or too little, making it less susceptible to exploitation. DAI also has a need for more liquidity on Fantom.</p>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Faq;
