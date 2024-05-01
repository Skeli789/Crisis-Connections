/**
 * The main page of the site.
 */

import React from "react";

// This CSS must go above the module imports!
// import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Home";

// This CSS must go below the module imports!
import './styles/App.css';
import './styles/components.css';

function App() {
    return (
        <div className="app">
            <Home/>
        </div>
    );
}

export default App;
