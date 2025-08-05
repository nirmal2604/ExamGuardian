import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme
} from '@mui/material';

const NavItem = ({ item, level = 1, pathDirect, onClick, isCollapsed = false }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.secondary,
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        {...(!item.external && { to: item.href })}
        {...(item.external && { href: item.href, target: '_blank' })}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        onClick={onClick}
      >

        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 'auto' : '36px',
            color: 'inherit',
            justifyContent: 'center',
          }}
        >
          {itemIcon}
        </ListItemIcon>

        {/* Only show text if not collapsed */}
        {!isCollapsed && (
          <ListItemText
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {item.title}
          </ListItemText>
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

export default NavItem;
