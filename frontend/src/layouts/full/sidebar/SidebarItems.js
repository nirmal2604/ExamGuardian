import React from 'react';
import MenuItems, { Menuitems as StaticMenuItems } from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useSelector } from 'react-redux';

const SidebarItems = ({ isCollapsed }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const menuItems = userInfo?.role ? MenuItems(userInfo.role) : StaticMenuItems; // fallback

  return (
    <Box
      sx={{
        px: isCollapsed ? 1 : 3, // smaller padding when collapsed
      }}
    >
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item) => {
          if (item.subheader) {
            return !isCollapsed ? (
              <NavGroup item={item} key={item.subheader} />
            ) : null;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                isCollapsed={isCollapsed}
              />
            );
          }
        })}

      </List>
    </Box>
  );
};

export default SidebarItems;
