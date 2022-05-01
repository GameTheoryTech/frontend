import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Typography, Grid, Container } from '@mui/material';
import MyGen0 from './myNFTs/myGen-0'
import MyGen1 from './myNFTs/myGen-1'

export default function MyNFTs() {
	const [activeTab, setActiveTab] = useState("tab1");
	const classes = useStyles();

	const handleTab1 = () =>{
			setActiveTab("tab1");
	};
	const handleTab2 = () => {
			setActiveTab("tab2");
	};
	
	return (
		<Container className={classes.genContainer} maxWidth="lg">
			<Box >
				<Grid className={classes.genNav} >
					<Typography className={activeTab === "tab1" ? classes.tabActive : classes.tabs} onClick={handleTab1}>Gen 0</Typography>
					<Typography className={activeTab === "tab2" ? classes.tabActive : classes.tabs} onClick={handleTab2}>Gen 1</Typography>
				</Grid>
				<Box className={classes.genField} >
						{activeTab ==="tab1" ? <MyGen0 /> : <MyGen1 />}
				</Box>
			</Box>
		</Container>
	);

};

const useStyles = makeStyles((theme) => ({
  
	genContainer: {
		paddingLeft: 0,
		paddingRight: 0
	},

	genField: {
		display: "flex",
		justifyContent: "center"
	},

	genNav: {
		display: "flex",
		justifyContent: "space-between",
		backgroundColor: "#000",
		width: 230,
		borderRadius: 30,
		marginBottom: 40,
		marginLeft: "auto",
		marginRight: "auto",
		padding: 1
	},

	tabs: {
		fontSize: 18,
		color: "#999898 !important",
		padding: "7px 34px",
		cursor: "pointer"
	},
	
	tabActive: {
		fontSize: 18,
		color: "#FFF",
		padding: "7px 34px",
		backgroundColor: "#ff24df",
		borderRadius: 20,
		cursor: "pointer"
	}
}));

