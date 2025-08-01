// Theme Provider
import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';
// Router Provider
import { RouterProvider, useRoutes } from 'react-router-dom';
import Router from './routes/Router';

// Redux Provider
import { Provider } from 'react-redux';
import store from './store';
// Tostify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import theme-related files
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import { getTheme } from './theme/Theme';

// Create a component that uses the theme
const ThemedApp = () => {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ToastContainer 
          theme={theme} // This makes toast notifications match your theme
        />
        <CssBaseline />
        <RouterProvider router={Router} />
      </Provider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  );
}

export default App;