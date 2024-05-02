/**
 * The main page of the site.
 */

import React from "react";
import { createTheme, alpha, getContrastRatio, ThemeProvider } from '@mui/material/styles';

// This CSS must go above the module imports!
// import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Home";

// This CSS must go below the module imports!
import './styles/App.css';
import './styles/components.css';

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

function App() {
    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <Home/>
            </ThemeProvider>
        </div>
    );
}

export default App;
