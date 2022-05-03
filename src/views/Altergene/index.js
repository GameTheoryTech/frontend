import React, {useEffect, useMemo} from 'react';
import Page from '../../components/Page';
import { Typography, Box, Button, Card, CardContent, Grid, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TokenSymbol from '../../components/TokenSymbol';
import CardIcon from '../../components/CardIcon';
import { Link } from 'react-router-dom';
import ReactPlayer from "react-player";

import nftIcon from '../../assets/img/1-nft.png';
import arcadeIcon from '../../assets/img/2-arcade.png';
import rpgIcon from '../../assets/img/3-rpg.png';
import wageringIcon from '../../assets/img/4-wagering.png';
import seigniorageIcon from '../../assets/img/5-seigniorage.png';

const useStyles = makeStyles((theme) => ({
    heading: {
        maxWidth: '100%',
        width: '500px',
        margin: '0 auto',
        fontWeight: '500'
    },
}));

import Unity, { UnityContext } from "react-unity-webgl";
const unityContext = new UnityContext({
    loaderUrl: "Build/Client.loader.js",
    dataUrl: "Build/Client.data",
    frameworkUrl: "Build/Client.framework.js",
    codeUrl: "Build/Client.wasm",
});

const useScript = url => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

const Altergene = () => {
    const classes = useStyles();
    const script = useScript("web3/index.js");
    return (
        <Unity unityContext={unityContext} style={{
            height: '100vh',
            width: '100vw',
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center'
        }}/>
    )
};

export default Altergene;