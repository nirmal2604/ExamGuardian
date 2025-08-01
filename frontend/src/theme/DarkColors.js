// src/theme/DarkColors.js
import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const basedarkTheme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'dark', // This tells MUI it's a dark theme
    primary: {
      main: '#5D87FF',
      light: '#1e293b',
      dark: '#4570EA',
    },
    secondary: {
      main: '#49BEFF',
      light: '#334155',
      dark: '#23afdb',
    },
    success: {
      main: '#13DEB9',
      light: '#0f2419',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#0f1419',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FA896B',
      light: '#2d1b16',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#2d2416',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#1e293b',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    grey: {
      100: '#334155',
      200: '#475569',
      300: '#64748b',
      400: '#94a3b8',
      500: '#cbd5e1',
      600: '#f1f5f9',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    action: {
      disabledBackground: 'rgba(255,255,255,0.12)',
      hoverOpacity: 0.08,
      hover: '#1e293b',
    },
    divider: '#475569',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  typography,
  shadows: shadows.map(() => 'none'), // Remove shadows for dark theme
});

export { basedarkTheme };