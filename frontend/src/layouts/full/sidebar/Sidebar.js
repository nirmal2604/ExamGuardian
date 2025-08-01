import { useState } from 'react';
import { useMediaQuery, Box, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  const expandedWidth = '270px';
  const collapsedWidth = '80px';

  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden', // prevents scroll bar when collapsed
              transition: 'width 0.3s ease',
            },
          }}
        >
          {/* Sidebar Content */}
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              px={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                py: 2,
              }}
            >
              {!isCollapsed && <Logo />}
              <IconButton onClick={handleToggle}>
                {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              {/* Sidebar Items with collapsed info */}
              <SidebarItems isCollapsed={isCollapsed} />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Mobile Sidebar (no collapse toggle for simplicity, optional to add)
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: expandedWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box px={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
        <Logo />
        {/* optional: close button */}
        <IconButton onClick={props.onSidebarClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <SidebarItems isCollapsed={false} />
    </Drawer>
  );
};

export default Sidebar;
