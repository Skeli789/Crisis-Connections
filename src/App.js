/**
 * The main page of the site.
*/

import React, { useEffect } from "react";
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    useNavigate,
} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// This CSS must go above the module imports!

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./Routes/Home";
import Caller from "./Routes/Caller";
import Error404 from "./Routes/Error404";
import Login from "./Routes/Login";

// This CSS must go below the module imports!
import './styles/App.css';

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
        <Footer />
    </ThemeProvider>
);

const router = createHashRouter([
    {
      element: <AppLayout />,
      children: [
        {
            path: "/caller",
            element: <Home /> 
        },
        {
            path: "/new",
            element: <Caller />
        },
        {
            path: "caller/:caller",
            element: <Caller />
        },
        {
            path: "archive/:caller",
            element: <Caller />
        },
        {
            path: "login",
            element: <Login />
        },
        {
            path: '*',
            element: <Error404/>
        },
        {
            path: "/",
            element: <Home />,
        }
      ]
    },
]);

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
        </LocalizationProvider>
    );
}

export default App;
