// Theme Provider
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme Context
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import { getTheme } from './theme/Theme';

// Router
import { RouterProvider } from 'react-router-dom';
import Router from './routes/Router'; // NOTE: this is a router object, not a component

const ThemedApp = () => {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ToastContainer theme={theme} />
        <CssBaseline />
        {/* Removed BrowserRouter — not needed when using RouterProvider */}
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={Router} />
        </Suspense>
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
