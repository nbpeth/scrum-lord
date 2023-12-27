import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Community } from './pages/Community/Community';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/communities/:communityId",
    element: <Community />,
  },
]);

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
