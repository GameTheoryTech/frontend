import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles'

export default function SortTag({ setSortBy, sortBy, direction, toggleDirection }) {
	const classes = useStyles();
  const tags = [
    { key: "price", title: "Price" },
    { key: "level", title: "Level" }
  ];
  const items = tags.map(({ key, title }) => {
    const active = key === sortBy;
    return (
      <HeadToggle
        key={key}
        active={active}
        onClick={() => {
          if (active) {
            toggleDirection();
          }
          setSortBy(key);
        }}
      >
        {title} {active ? (direction === "asc" ? " (asc)" : " (dsc)") : null}
      </HeadToggle>
    );
  });
  return (
		<Grid className={classes.sortField} >
			<h3>Sort by: </h3>
			<Grid>{items}</Grid>
		</Grid>
  );
}

function HeadToggle({ children, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      style={{ fontWeight: active ? "bold" : "normal", cursor: "pointer" }}
    >
      {children}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
	sortField: {
		width: 300,
		alignItems: 'center',
		display: 'flex',
		marginRight: 22,
		marginBottom: 25,
		justifyContent: 'space-around',
		position: 'absolute',
		right: 0,
		// float: 'right',
		'& button': {
			padding: '5px 25px'
		},
		'@media (max-width: 640px)': {
      marginTop: 66
    }
	}
}));
