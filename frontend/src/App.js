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

// Routes
import Router from './routes/Router';

const ThemedApp = () => {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ToastContainer theme={theme} />
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Router />
          </Suspense>
        </BrowserRouter>
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
