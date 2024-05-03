/**
 * The main page of the site.
*/

import React from "react";
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
} from "react-router-dom";
// import { useQuery } from '@tanstack/react-query';
// import { getActiveCallers, getArchivedCallers } from './api.js';

// This CSS must go above the module imports!

import NavBar from "./components/NavBar";
import Home from "./Routes/Home";
import Caller from "./Routes/Caller";

// This CSS must go below the module imports!
import './styles/App.css';
import './styles/components.css';

// Themeing for Material UI
const blueBase = '#005291';
const blueMain = alpha(blueBase, 0.9);
const theme = createTheme({
    palette: {
      primary: {
        light: alpha(blueBase, 0.5),
        main: blueMain,
        dark: alpha(blueBase, 1),
        contrastText: getContrastRatio(blueMain, '#fff') > 4.5 ? '#fff' : '#111',
      }
    },
});

const AppLayout = () => (
    <ThemeProvider theme={theme}>
        <NavBar />
        <Outlet />
    </ThemeProvider>
);

const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/caller",
          element: <Caller /> 
        }
      ]
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;