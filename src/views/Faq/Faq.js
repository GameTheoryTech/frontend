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
              <p>No, but I enjoy their community and what they're building! Check them out, they deserve another chance.</p>
              <h3>Will you renounce the contracts?</h3>
              <p>Maybe, but I rather use a multisig for emergency purposes. Since this project has new code than normal tomb forks, it may be hard to get the parameters right the first go around. Hopefully, some trustworthy good actors show up so that I can set up a multisig wallet. I've also changed the contracts a bunch to make not renouncing less dangerous.</p>
              <h3>Will you undergo KYC?</h3>
              <p>KYC is useless. A rugpull will rug you no matter what, and no Tomb fork is 100% safe from rugs. Trust the team/dev. Additionally, I'm shy and I like my privacy. Maybe KYC will happen if Game Theory gets big enough to form a corporation. Let's put it this way: Would I really go through the trouble to create something more unique and put in extra security measures if I wanted to rug you?</p>
              <h3>Will Game Theory be audited?</h3>
              <p>Totally, if we get big enough to afford it!</p>
              <h3>Why DAI?</h3>
              <p>For its stability, simplicity, and for the fact that it is not used too much or too little, making it less susceptible to attacks by big money. Also, I heard that DAI has a liquidity problem, so that might come in handy!</p>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Faq;
