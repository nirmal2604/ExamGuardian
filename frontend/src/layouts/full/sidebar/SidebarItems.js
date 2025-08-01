import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useSelector } from 'react-redux';

const SidebarItems = ({ isCollapsed }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const pathDirect = pathname;

  return (
    <Box
      sx={{
        px: isCollapsed ? 1 : 3, // smaller padding when collapsed
      }}
    >
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // Skip certain items for student
          if (
            userInfo.role === 'student' &&
            ['Create Exam', 'Add Questions', 'Exam Logs'].includes(item.title)
          ) {
            return null;
          }

          // Handle subheader/group
          if (item.subheader) {
            if (userInfo.role === 'student' && item.subheader === 'Teacher') {
              return null;
            }

            // ✅ When collapsed, you might want to hide group labels:
            return !isCollapsed ? (
              <NavGroup item={item} key={item.subheader} />
            ) : null;
          } else {
            // ✅ Pass isCollapsed to NavItem so it can show only icon
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
