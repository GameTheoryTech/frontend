import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Mint from './components/Mint';
import { makeStyles } from '@mui/styles';

import NftCards from './components/nftCards';

import { Paper, Box, Card, CardContent, Button, Typography, Grid, Container, AccordionDetails } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import ReactPlayer from 'react-player';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

import { createGlobalStyle } from 'styled-components';
import axios from "axios";
import useFetchTheoryUnlockers from "../../hooks/useFetchTheoryUnlockers";
import useTokenCanUnlockAmount from "../../hooks/useTokenCanUnlockAmount";
import {getDisplayBalance} from "../../utils/formatBalance";
import useUnlockTheory from "../../hooks/useUnlockTheory";
import useUnlockTheoryWithNFT from "../../hooks/useUnlockTheoryWithNFT";
import useMaxLevel from "../../hooks/useMaxLevel";
import useLevelUpTheoryUnlocker from "../../hooks/useLevelUpTheoryUnlocker";
import useModal from "../../hooks/useModal";
import MergeModal from "./components/MergeModal";
import useMintTheoryUnlocker from "../../hooks/useMintTheoryUnlocker";
import useMergeTheoryUnlocker from "../../hooks/useMergeTheoryUnlocker";
import useFetchTheoryUnlockersGen1 from "../../hooks/useFetchTheoryUnlockersGen1";
import useLevelUpTheoryUnlockerGen1 from "../../hooks/useLevelUpTheoryUnlockerGen1";
import useMaxLevelGen1 from "../../hooks/useMaxLevelGen1";
import useMergeTheoryUnlockerGen1 from "../../hooks/useMergeTheoryUnlockerGen1";
import useUnlockTheoryWithNFTGen1 from "../../hooks/useUnlockTheoryWithNFTGen1";
import AddIcon from '@mui/icons-material/Add';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ExpandMore as ChevronDownIcon } from '@mui/icons-material';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { Pagination } from 'swiper';
import 'swiper/swiper-bundle.css'

import useTombFinance from "../../hooks/useTombFinance";
import useApprove, {ApprovalState} from "../../hooks/useApprove";

const Accordion = ((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
));

const AccordionSummary = ((props) => (
  <MuiAccordionSummary
    expandIcon={<AddIcon style={{color: "#fff"}} />}
    {...props}
  />
));

const useStyles = makeStyles((theme) => ({
  slider: {
    overflow: 'initial!important',
    '& .swiper-slide': {
      transform: 'scale(.85) translateZ(0)',
      filter: 'blur(5px)',
      transition: 'all .3s ease-out',
    },
    '& .swiper-slide-active': {
      transform: 'scale(1) translateZ(0)',
      filter: 'blur(0px)',
    },
    '& .swiper-pagination': {
      position: 'relative',
      bottom: '0',
      marginTop: '20px',
      '& .swiper-pagination-bullet': {
        width: '12px',
        height: '12px',
        background: 'rgba(47,240,221,0.3)',
        margin: '0 6px',
        opacity: '1',
        transform: 'scale(0.8) translateZ(0)',
        transition: 'all .2s ease-out',
        '&.swiper-pagination-bullet-active': {
          background: 'rgba(47,240,221,1)',
          transform: 'scale(1) translateZ(0)',
          boxShadow: '0px 0px 10px 1px rgba(47,240,221,1)',
        },
      }
    }
  },
  slideItem: {
    border: '1px solid #fff',
    borderRadius: '20px',
    backgroundColor: '#fff',
    '& > .video': {
      position: 'relative',
      width: '100%!important',
      height: '0!important',
      paddingBottom: '56.25%',
      '& > video': {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        backgroundColor: '#000',
      },
    },
    '& .bottom-meta': {
      padding: '20px',
      color: "#172137"
    },
  },
  advanced: {
    width: '100%',
    textAlign: 'center',
    '& .advanced-toggle' : {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
    '& .advanced-info' : {
      display: 'none',
      marginBottom: '20px'
    },
    '&.open' : {
      '& .advanced-info' : {
        display: 'block',
      },
      '& .advanced-toggle' : {
        '& svg' : {
          transform: 'rotate(180deg)'
        }
      }
    }
  },
  button : {
    width: '2em',
    height: '2em',
    fontSize: '14px',
    padding: '0',
    minWidth: 'auto'
  },
}));

import Modal, { ModalProps } from '../../components/Modal';
import ModalActions from '../../components/ModalActions';
import useLevelUpToTheoryUnlockerGen1 from "../../hooks/useLevelUpToTheoryUnlockerGen1";
import useTheoryUnlockerGen1TotalMinted from "../../hooks/useTheoryUnlockerGen1TotalMinted";
import useTheoryUnlockerGen1Supply from "../../hooks/useTheoryUnlockerGen1Supply";
import useTheoryUnlockerGen1MaxMinted from "../../hooks/useTheoryUnlockerGen1MaxMinted";

const Nft = () => {
  let selectedId = "0";
  const [onPresentMerge, onDismissMerge] = useModal(
      <MergeModal
          onConfirm={(value) => {
            onMerge(selectedId, value);
            onDismissMerge();
          }}
          tokenName={'TU'}
      />,
  );
  const [onPresentMergeGen1, onDismissMergeGen1] = useModal(
      <MergeModal
          onConfirm={(value) => {
            onMergeGen1(selectedId, value);
            onDismissMerge();
          }}
          tokenName={'TUG1'}
      />,
  );
  const classes = useStyles();
  const { account } = useWallet();
  const theoryUnlockers = useFetchTheoryUnlockers();
  const theoryUnlockersGen1 = useFetchTheoryUnlockersGen1();
  const { onUnlockTheory } = useUnlockTheoryWithNFT();
  const onUnlockTheoryGen1 = useUnlockTheoryWithNFTGen1().onUnlockTheory;
  const { onLevelUp } = useLevelUpTheoryUnlocker();
  const onLevelUpGen1 = useLevelUpTheoryUnlockerGen1().onLevelUp;
  const onLevelUpToGen1 = useLevelUpToTheoryUnlockerGen1().onLevelUpTo;
  const maxLevel = useMaxLevel();
  const maxLevelGen1 = useMaxLevelGen1();
  const { onMerge } = useMergeTheoryUnlocker();
  const onMergeGen1 = useMergeTheoryUnlockerGen1().onMerge;
  //const costGen1 = useCostGen1(theoryUnlockersGen1);
  const tombFinance = useTombFinance();
  const [approveStatus, approve] = useApprove(tombFinance?.TOMB, tombFinance?.contracts.TheoryUnlockerGen1.address);

  const totalMintedBronze = useTheoryUnlockerGen1TotalMinted(1);
  const maxMintedBronze = useTheoryUnlockerGen1MaxMinted(1);

  const totalMintedSilver = useTheoryUnlockerGen1TotalMinted(20);
  const maxMintedSilver = useTheoryUnlockerGen1MaxMinted(20);

  const totalMintedGold = useTheoryUnlockerGen1TotalMinted(40);
  const maxMintedGold = useTheoryUnlockerGen1MaxMinted(40);

  const totalMintedPlatinum = useTheoryUnlockerGen1TotalMinted(50);
  const maxMintedPlatinum = useTheoryUnlockerGen1MaxMinted(50);

  const [expanded, setExpanded] = React.useState('panel1');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [AdvancedOpen, setAdvancedOpen] = React.useState(false);

  const handleAdvancedOpen = () => {
    (AdvancedOpen === false) ? setAdvancedOpen(true) : setAdvancedOpen(false);
  };

  const handleStatsClose = () => {
    onCloseStats();
  };
  
  const [onHandleStats, onCloseStats] = useModal(
    <Modal text="Advanced Stats" onDismiss={handleStatsClose}>
      <Typography variant="h6" color="#fff" style={{fontWeight: '500'}}>
      <strong>Generation</strong><br />The generation number of the NFT.<br /><br />
      
      <strong>Tier</strong><br />The Color of the NFT.<br /><br />
      <strong>Current Level</strong><br />The current level of the NFT (The original minted level, combined with any additional levels added by levelling up).<br /><br />
      <strong>Serial Number</strong><br />Which number this NFT is in the series (based on the Generation and Tier).<br /><br />
      <strong>Total Available</strong><br />How many of this type of NFT (generation and tier) are available versus how many exist in total.<br /><br />
      <strong>Merges Available</strong><br />How many times remaining this NFT can be merged with other NFT's. See below for more details.
      </Typography>
      <ModalActions>
        <Button color="primary" variant="contained" onClick={handleStatsClose} fullWidth>
          Close
        </Button>
      </ModalActions>
    </Modal>
  );

  const overallTime = (item) => {
    let time        = item.timeLeftToLevel.toNumber();
    let days        = Math.floor(time/24/60/60);
    let hoursLeft   = Math.floor((time) - (days*86400));
    let hours       = Math.floor(hoursLeft/3600);
    let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
    let minutes     = Math.ceil(minutesLeft/60);
    //if(minutes === 0) minutes = 1; //Never show 0 minutes.
    //let seconds     = time % 60;

    days = days.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
    hours = hours.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
    minutes = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

    return time == 0 ?  "Now!" : (days + ":" + hours + ":" + minutes);
  };

  //console.log(theoryUnlockers);

  // get slider current slide index
  const [sliderIndex, setSliderIndex] = React.useState(0);
  const onSlideChange = (swiper) => {
    setSliderIndex(swiper.realIndex);
  };
  const isSwiperGen1 = sliderIndex >= theoryUnlockers.length;
  const sliderItem = (theoryUnlockers.length > 0 || theoryUnlockersGen1.length > 0) ? (isSwiperGen1 ? theoryUnlockersGen1[sliderIndex-theoryUnlockers.length] : theoryUnlockers[sliderIndex]) : null;

    return (
    <Page>
      {!!account ? (
        <>
            {(theoryUnlockers.length > 0 || theoryUnlockersGen1.length > 0) && (
              <>
              <Grid className="section" container spacing={3} align="center" justifyItems="center" style={{paddingBottom: '0'}}>
                <Grid item xs={12}>
                  <Typography align="center" variant="h2" className="textGlow pink" style={{marginBottom: '50px'}}>
                    My NFT Collection
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="textGlow">
                    Current Max Level
                  </Typography>
                  <Typography variant="h4">
                    {maxLevel.toNumber()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="textGlow">
                    Next Level Available
                  </Typography>
                  <Typography variant="h4">
                    {overallTime(sliderItem)}
                  </Typography>
                </Grid>

                <Grid item xs={12} style={{marginTop: '20px'}}>

                  <Swiper
                    modules={[Pagination]}
                    direction="horizontal"
                    slidesPerView={1}
                    spaceBetween={15}
                    loop={false}
                    centeredSlides={true}
                    breakpoints={{ 
                      767: {
                        slidesPerView: 2,
                        spaceBetween: 30 
                      },
                    }}
                    pagination={{
                      el: '.swiper-pagination',
                      clickable: true,
                    }}
                    className={classes.slider}
                    onSlideChange={onSlideChange}
                    grabCursor={true}
                  >
                    {
                    theoryUnlockers.map((item, index) => {

                      return (
                        <SwiperSlide key={`genZero${index}`}>
                          <div className={`${classes.slideItem} ${item.attributes[0].value.toLowerCase()}`}>
                            <ReactPlayer className="video" url={item.animation_url} controls={false} muted={true} playing={true} loop={true} />
                            <Grid container className="bottom-meta" justify="center" alignItems="center">

                              <Grid item xs={4}>
                                <Typography variant="body1">
                                  Generation
                                </Typography>
                                <Typography variant="h4">
                                  0
                                </Typography>
                              </Grid>

                              <Grid item xs={4}>
                                <Typography variant="body1">
                                  Tier
                                </Typography>
                                <Typography variant="h4">
                                  {item.attributes[0].value}
                                </Typography>
                              </Grid>

                              <Grid item xs={4}>
                                <Typography variant="body1">
                                  Level
                                </Typography>
                                <Typography variant="h4">
                                  {item.level.toNumber()}
                                </Typography>
                              </Grid>

                            </Grid>
                          </div>
                        </SwiperSlide>
                      );
                    })
                    }
                    {
                      theoryUnlockersGen1.map((item, index) => {

                        return (
                            <SwiperSlide key={`genOne${index}`}>
                              <div className={`${classes.slideItem} ${item.attributes[0].value.toLowerCase()}`}>
                                <ReactPlayer className="video" url={item.animation_url} controls={false} muted={true} playing={true} loop={true} />
                                <Grid container className="bottom-meta" justify="center" alignItems="center">

                                  <Grid item xs={4}>
                                    <Typography variant="body1">
                                      Generation
                                    </Typography>
                                    <Typography variant="h4">
                                      1
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={4}>
                                    <Typography variant="body1">
                                      Tier
                                    </Typography>
                                    <Typography variant="h4">
                                      {item.attributes[0].value}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={4}>
                                    <Typography variant="body1">
                                      Level
                                    </Typography>
                                    <Typography variant="h4">
                                      {item.level.toNumber()}
                                    </Typography>
                                  </Grid>

                                </Grid>
                              </div>
                            </SwiperSlide>
                        );
                      })
                    }
                    <div className="swiper-pagination" />
                  </Swiper>
                </Grid>
              </Grid>
            </>
          )}

          {sliderItem && !isSwiperGen1 && (
            <>
            <Grid container className="bottom-meta" align="center" justifyContent="center" style={{marginTop: '20px'}}>
              <Grid item xs={12} sm={6}>
                <Grid container align="center" justifyContent="center">
                <div className={`${classes.advanced} ${AdvancedOpen ? 'open' : ''}`}>
            <div className='advanced-toggle' onClick={handleAdvancedOpen}>
              <Typography align="center" style={{display: 'inline-block',cursor: 'pointer',fontWeight: '700'}} className='textGlow pink'>
                <span style={{verticalAlign: 'middle'}}>{AdvancedOpen ? "Hide Advanced" : "Show Advanced"}</span>
                <ChevronDownIcon style={{verticalAlign: 'middle'}} />
              </Typography>
            </div>
            <div className="advanced-info">
              <Card>
                <CardContent align="center">
                  <Typography variant='h4' className="kallisto" style={{marginBottom: '10px'}}>
                    Advanced Stats
                    <Button variant="contained" className={classes.button} aria-label="Advanced stats info" style={{ marginLeft: '10px' }} onClick={onHandleStats}>
                      <QuestionMarkIcon fontSize='inherit' />
                    </Button>
                  </Typography>
                  <Grid container justifyContent="center">
                    <TableContainer component={Paper} style={{width: 'initial'}}>
                      <Table aria-label="advanced info table">
                        <TableBody>

                          <TableRow>
                            <TableCell align="right">
                              <Typography variant="body1" component="p" className="textGlow">
                                Generation
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                0
                              </Typography>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="right">
                              <Typography variant="body1" component="p" className="textGlow">
                                Tier
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {sliderItem.attributes[0].value}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="right">
                              <Typography variant="body1" component="p" className="textGlow">
                                Current Level
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                {sliderItem.level.toNumber()}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="right">
                              <Typography variant="body1" component="p" className="textGlow">
                                Serial Number
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                #{sliderItem.token_id.toNumber()}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="right">
                              <Typography variant="body1" component="p" className="textGlow">
                                Merges Available
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                Unlimited
                              </Typography>
                            </TableCell>
                          </TableRow>

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </div>
                </Grid>
                <Button color="primary" variant="contained" fullWidth disabled={sliderItem.unlockAmount.eq(0)} onClick={()=>onUnlockTheory(sliderItem.token_id)} style={{marginBottom: '20px'}}>{`Unlock ${getDisplayBalance(sliderItem.unlockAmount)} LTHEORY Using This NFT`}</Button>
                <Typography variant="body1" className="textGlow" component="p" style={{marginBottom: '20px'}}>
                  New LTHEORY Tokens can only be unlocked once using NFTs.
                </Typography>
                <Button color="primary" variant="contained" fullWidth disabled={!sliderItem.timeLeftToLevel.eq(0) || sliderItem.level.gte(maxLevel)} onClick={() => onLevelUp(sliderItem.token_id)} style={{marginBottom: '20px'}}> { sliderItem.level.eq(maxLevel) ? ("Current Max Level Reached") : ("Level Up") }
                </Button>
                <Button color="primary" variant="contained" fullWidth disabled={theoryUnlockers.length <= 1} onClick={() => {
                  selectedId = sliderItem.token_id
                  onPresentMerge();
                }} >
                  {`Merge`}
                </Button>
              </Grid>
            </Grid>
            </>
          )}
          {sliderItem && isSwiperGen1 && (
              <>
                <Grid container className="bottom-meta" align="center" justifyContent="center" style={{marginTop: '20px'}}>
                  <Grid item xs={12} sm={6}>
                    <Grid container align="center" justifyContent="center">
                      <div className={`${classes.advanced} ${AdvancedOpen ? 'open' : ''}`}>
                        <div className='advanced-toggle' onClick={handleAdvancedOpen}>
                          <Typography align="center" style={{display: 'inline-block',cursor: 'pointer',fontWeight: '700'}} className='textGlow pink'>
                            <span style={{verticalAlign: 'middle'}}>{AdvancedOpen ? "Hide Advanced" : "Show Advanced"}</span>
                            <ChevronDownIcon style={{verticalAlign: 'middle'}} />
                          </Typography>
                        </div>
                        <div className="advanced-info">
                          <Card>
                            <CardContent align="center">
                              <Typography variant='h4' className="kallisto" style={{marginBottom: '10px'}}>
                                Advanced Stats
                                <Button variant="contained" className={classes.button} aria-label="Advanced stats info" style={{ marginLeft: '10px' }} onClick={onHandleStats}>
                                  <QuestionMarkIcon fontSize='inherit' />
                                </Button>
                              </Typography>
                              <Grid container justifyContent="center">
                                <TableContainer component={Paper} style={{width: 'initial'}}>
                                  <Table aria-label="advanced info table">
                                    <TableBody>

                                      <TableRow>
                                        <TableCell align="right">
                                          <Typography variant="body1" component="p" className="textGlow">
                                            Generation
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                            1
                                          </Typography>
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell align="right">
                                          <Typography variant="body1" component="p" className="textGlow">
                                            Tier
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                            {sliderItem.attributes[0].value}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell align="right">
                                          <Typography variant="body1" component="p" className="textGlow">
                                            Current Level
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                            {sliderItem.level.toNumber()}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell align="right">
                                          <Typography variant="body1" component="p" className="textGlow">
                                            Serial Number
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                            #{sliderItem.token_id.toNumber()}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell align="right">
                                          <Typography variant="body1" component="p" className="textGlow">
                                            Merges Available
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>
                                            {sliderItem.merged ? 0 : 1}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>

                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </Grid>
                    <Button color="primary" variant="contained" fullWidth disabled={sliderItem.unlockAmount.eq(0)} onClick={()=>onUnlockTheory(sliderItem.token_id)} style={{marginBottom: '20px'}}>{`Unlock ${getDisplayBalance(sliderItem.unlockAmount)} LTHEORY Using This NFT`}</Button>
                    <Typography variant="body1" className="textGlow" component="p" style={{marginBottom: '20px'}}>
                      New LTHEORY Tokens can only be unlocked once using NFTs.
                    </Typography>
                    {approveStatus !== ApprovalState.APPROVED ? (<Button color="primary" variant="contained" fullWidth disabled={approveStatus !== ApprovalState.NOT_APPROVED} onClick={approve} style={{marginBottom: '20px'}}> Approve GAME for Level Up
                    </Button>) : (<Button color="primary" variant="contained" fullWidth disabled={!sliderItem.timeLeftToLevel.eq(0) || sliderItem.level.gte(maxLevel)} onClick={() => onLevelUpGen1(sliderItem.token_id)} style={{marginBottom: '20px'}}> { sliderItem.level.eq(maxLevel) ? ("Current Max Level Reached") : (`Level Up for ${getDisplayBalance(sliderItem.cost, 18, 0)} GAME`) }
                        </Button>)
                    }
                    {approveStatus !== ApprovalState.APPROVED ? (<Button color="primary" variant="contained" fullWidth disabled={approveStatus !== ApprovalState.NOT_APPROVED} onClick={approve} style={{marginBottom: '20px'}}> Approve GAME for Level Up
                    </Button>) : (<Button color="primary" variant="contained" fullWidth disabled={!sliderItem.timeLeftToLevel.eq(0) || sliderItem.level.gte(maxLevel)} onClick={() => onLevelUpToGen1(sliderItem.token_id, maxLevelGen1)} style={{marginBottom: '20px'}}> { sliderItem.level.eq(maxLevel) ? ("Current Max Level Reached") : (`Max Level Up for ${getDisplayBalance(sliderItem.maxCost, 18, 0)} GAME`) }
                    </Button>)
                    }
                    <Button color="primary" variant="contained" fullWidth disabled={sliderItem.merged || theoryUnlockersGen1.length <= 1} onClick={() => {
                      selectedId = sliderItem.token_id
                      onPresentMergeGen1();
                    }} >
                      {`Merge`}
                    </Button>
                  </Grid>
                </Grid>
              </>
          )}

{/* Generation 1 NFTs to purchase*/}
<Grid className="section" container justify="center" align="center" spacing={3}>

<Grid item xs={12} style={{marginBottom: '50px'}}>
<Typography align="center" variant="h2" className="textGlow pink" style={{marginBottom: '20px'}}>
Generation 1 NFTs
</Typography>
<Typography align="center" variant="h5" component="p" style={{fontWeight: '500'}}>
LTHEORY Unlockers available to Mint
</Typography>
</Grid>

<Grid item xs={12} sm={6} md={3}>
<NftCards card="bronze" />
<TableContainer component={Paper} style={{marginTop: '20px'}}>
<Table aria-label="Bronze card table">
<TableBody>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Generation
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Total Available
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        {maxMintedBronze.sub(totalMintedBronze).toString()} of {maxMintedBronze.toString()}
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Mint Level
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1 - 19
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Floor Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        500 DAI
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Merge Limit
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1 Merge
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Level Up Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        See Below
      </Typography>
    </TableCell>
  </TableRow>

</TableBody>
</Table>
</TableContainer>
<Mint name="Silver" minValue={1} maxValue={19} />
</Grid>

<Grid item xs={12} sm={6} md={3}>
<NftCards card="silver" />
<TableContainer component={Paper} style={{marginTop: '20px'}}>
<Table aria-label="Silver card table">
<TableBody>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Generation
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Total Available
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        {maxMintedSilver.sub(totalMintedSilver).toString()} of {maxMintedSilver.toString()}
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Mint Level
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        20 - 39
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Floor Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        10,000 DAI
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Merge Limit
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1 Merge
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Level Up Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        See Below
      </Typography>
    </TableCell>
  </TableRow>

</TableBody>
</Table>
</TableContainer>
<Mint name="Silver" minValue={20} maxValue={39} />
</Grid>

<Grid item xs={12} sm={6} md={3}>
<NftCards card="gold" />
<TableContainer component={Paper} style={{marginTop: '20px'}}>
<Table aria-label="Gold card table">
<TableBody>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Generation
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Total Available
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        {maxMintedGold.sub(totalMintedGold).toString()} of {maxMintedGold.toString()}
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Mint Level
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        40 - 49
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Floor Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        20,000 DAI
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Merge Limit
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1 Merge
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Level Up Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        See Below
      </Typography>
    </TableCell>
  </TableRow>

</TableBody>
</Table>
</TableContainer>
<Mint name="Gold" minValue={40} maxValue={49} />
</Grid>

<Grid item xs={12} sm={6} md={3}>
<NftCards card="platinum" />
<TableContainer component={Paper} style={{marginTop: '20px'}}>
<Table aria-label="Platinum card table">
<TableBody>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Generation
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Total Available
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        10 of 10
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Mint Level
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        {maxMintedPlatinum.sub(totalMintedPlatinum).toString()} of {maxMintedPlatinum.toString()}
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Floor Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        25,000 DAI
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Merge Limit
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        1 Merge
      </Typography>
    </TableCell>
  </TableRow>

  <TableRow>
    <TableCell align="right">
      <Typography variant="body1" component="p" className="textGlow">
        Level Up Price
      </Typography>
    </TableCell>
    <TableCell>
      <Typography>
        See Below
      </Typography>
    </TableCell>
  </TableRow>

</TableBody>
</Table>
</TableContainer>
<Mint name="Platinum" minValue={50} maxValue={50} />
</Grid>

</Grid>

<Grid className="section" container justify="center" align="center" style={{paddingTop: '0'}} spacing={3}>

  <Grid item xs={12}>
    <Typography align="center" variant="h2" className="textGlow pink" style={{marginBottom: '20px'}}>
      NFT Marketplace
    </Typography>
    <Typography align="center" variant="h5" component="p" style={{fontWeight: '500'}}>
      Coming soon
    </Typography>
  </Grid>
</Grid>

          <Grid id="faq" className="section" container spacing={3} style={{paddingTop: '0'}}>
        {/* Explanation text */}
        <Grid item xs={12}>
            <Typography variant="h2" className='textGlow pink' style={{textAlign:'center',marginBottom: '20px'}}>About Game Theory NFTs</Typography>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography variant="h5" color="var(--extra-color-1)">What is an NFT?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  An NFT or non-fungible token is a one-of-a-kind digital collectable that is owned exclusively by the person who purchased it.
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography variant="h5" color="var(--extra-color-1)">What are the benefits of Game Theory NFTs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" component={'span'}>
                  Game Theory NFTs can be used in the following ways:<br /><br />
                  <ol>
                    <li key={"info0"}>
                      They can unlock a percentage of locked THEORY (LTHEORY) rewards owned by the user.
                    </li>
                    <li key={"info1"}>
                      They will allow the user access to exclusive perks, items and events in the "Brutal Network" game.
                    </li>
                    <li key={"info2"}>
                      The NFTs can be bought and sold on the NFT marketplace.
                    </li>
                  </ol>
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography variant="h5" color="var(--extra-color-1)">How much LTHEORY can I unlock with an NFT?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  The level of your NFT can unlock the corresponding percentage of LTHEORY you have. ie. If you have a level 10 NFT, it will have the ability to unlock 10% of your LTHEORY rewards. As you level up your NFT, the percentage of LTHEORY rewards you can unlock will also increase.<br /><br />

                  IMPORTANT: While an NFT can be used multiple times, the LTHEORY tokens you use the NFT on, can only be unlocked with an NFT once. ie. If you have 100 LTHEORY tokens in your wallet and a level 10 NFT, you can unlock 10 of those tokens, but those remaining 90 LTHEORY tokens can now no longer be unlocked with an NFT.
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                <Typography variant="h5" color="var(--extra-color-1)">How much do Game Theory NFTs cost?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" style={{fontWeight: '500'}}>
                  <strong>Price of Minting NFTs</strong><br />
                  Game Theory tokens cost 500 DAI per level when minting an NFT. When you choose to mint an NFT, you can select the level you would like to mint it at, and the total price of minting will be the level number x 500 DAI.<br /><br />

                  <strong>Price of NFTs on the Marketplace</strong><br />
                  The price of purchasing or selling existing NFTs in the marketplace will be determined based on what people are prepared to sell or pay for them (based on rarity, level, supply and demand).
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h5" color="var(--extra-color-1)">How can I level up my NFTs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  The maximum level available to level up an NFT will increase by 5 levels every 15 days.<br /><br/>

                  Generation 0 NFTs can be levelled up for free, while Generation 1 NFTs have a fee in GAME to level up.<br /><br/>

                  The GAME fees to level up Gen 1 NFTs are as follows can be <a href="https://docs.gametheory.tech/" target="_blank" style={{color:'var(--accent)'}}>found in the docs</a>.
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
              <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
                <Typography variant="h5" color="var(--extra-color-1)">How can I merge my NFTs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  NFTs can only be merged with NFTs of the same generation number. ie. Gen 0 NFTs can only be merged with other Gen 0 NFTs, Gen1 NFTs can only be merged with other Gen 1 NFTs.<br /><br />

                  Gen 0 NFTs can be merged an unlimited amount of times, Gen 1 NFTs can only be merged once.<br /><br />

                  Merging NFTs will combine the levels of the NFTs, and the new NFT will become the highest tier (or color) out of the two merged NFTs.
                </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
              <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
                <Typography variant="h5" color="var(--extra-color-1)">Can I use my NFT to unlock LGAME?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  No, the NFTs only unlock LTHEORY. LGAME tokens unlock linearly over 365 days after they are claimed.
                </Typography>
                </AccordionDetails>
              </Accordion>
        </Grid>
      </Grid>


        </>
      ) : (
        <UnlockWallet />
      )}

    </Page>
  );
};

export default Nft;
