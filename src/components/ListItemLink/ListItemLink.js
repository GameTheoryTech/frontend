import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemText } from '@mui/material';

const ListItemLink = ({ primary, to, classname = '' }) => {
  const CustomLink = React.useMemo(
    () => React.forwardRef((linkProps, ref) => <NavLink exact activeClassName="active" ref={ref} to={to} {...linkProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={CustomLink} className={classname}>
        <ListItemText style={{fontFamily: '"kallisto", sans-serif'}} primary={primary} />
      </ListItem>
    </li>
  );
};

export default ListItemLink;
