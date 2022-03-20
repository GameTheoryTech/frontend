import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@mui/material/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import TombFinanceProvider from './contexts/TombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
import Regulations from './views/Regulations/Regulations';
import { RefreshContextProvider } from './contexts/RefreshContext';

const Home = lazy(() => import('./views/Home'));
const Farms = lazy(() => import('./views/Cemetery'));
const Boardroom = lazy(() => import('./views/Masonry'));
//const Rebates = lazy(() => import('./views/Rebates'));
const Bonds = lazy(() => import('./views/Pit'));
const Treasury = lazy(() => import('./views/Treasury'));
const Faq = lazy(() => import('./views/Faq'));
// const SBS = lazy(() => import('./views/Sbs'));
// const Liquidity = lazy(() => import('./views/Liquidity'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const App: React.FC = () => {
  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.1') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.1');
  }

  usePromptNetwork();

  return (
    <Providers>
      <Router basename='/'>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/theoretics">
              <Boardroom />
            </Route>
            <Route path="/bonds">
              <Bonds />
            </Route>
            <Route path="/treasury">
              <Treasury />
            </Route>
            <Route path="/faq">
              <Faq />
            </Route>
            {/* <Route path="/sbs">
              <SBS />
            </Route>
            <Route path="/regulations">
              <Regulations />
            </Route>
            <Route path="/liquidity">
              <Liquidity />
            </Route> */}
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider
          chainId={config.chainId}
          connectors={{
            walletconnect: { rpcUrl: config.defaultProvider },
            walletlink: {
              url: config.defaultProvider,
              appName: 'Game Theory',
              appLogoUrl: './GAME-01.png',
            },
          }}
        >
          <Provider store={store}>
            <Updaters />
            <RefreshContextProvider>
              <TombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <>
                      <Popups />
                      {children}
                    </>
                  </BanksProvider>
                </ModalsProvider>
              </TombFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
