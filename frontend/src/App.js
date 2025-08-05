// Theme Provider
import { CssBaseline, ThemeProvider } from '@mui/material';
// Router
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/Router';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme Context
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import { getTheme } from './theme/Theme';

const ThemedApp = () => {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ToastContainer theme={theme} />
        <CssBaseline />
        <BrowserRouter>
          <Router />  {/* ✅ FIXED this line */}
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
