// src/theme/Theme.js
import { baselightTheme } from './DefaultColors';
import { basedarkTheme } from './DarkColors';

export const getTheme = (themeMode) => {
  return themeMode === 'dark' ? basedarkTheme : baselightTheme;
};