/**
 * Home Page Content
*/

import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import CardList from "./components/CardList";
import NavBar from "./components/NavBar";

import './styles/Home.css';

// https://app.json-generator.com/
const apiKey = 'z1439pyatt1xjy2bug8y7ttt7piedbwx4o0n54gr';
const fakeData = `https://api.json-generator.com/templates/5B2bJ0QIu25x/data?access_token=${apiKey}`;

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Home() {
    const [callers, setCallers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [listType, setListType] = useState(0);
    const [activeCallers, setActiveCallers] = useState([]);
    const [archivedCallers, setArchivedCallers] = useState([]);

    useEffect(() => {
        fetch(fakeData, {
          method: "GET"
        }).then((response) => response.json()).then((data) => {
            // get all callers and sort callHistory (and profile) by most recent
            const callerList = data.map(caller => {
                return ({
                    callHistory: caller.callHistory.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)),
                    ...caller
                })
            }).sort((a,b) => new Date(b.callHistory[0].dateTime) - new Date(a.callHistory[0].dateTime));
            const activeCallers = callerList.filter(caller => !caller.archived.isArchived);
            const archivedCallers = callerList.filter(caller => caller.archived.isArchived)
            setActiveCallers(activeCallers);
            setArchivedCallers(archivedCallers);
            setCallers(activeCallers);
            setIsLoaded(true);
        }).catch((error) => console.log(error));
    }, []);

    function Content() {
        if (isLoaded) {
            return (
                <CardList callers={callers}/>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                    <CircularProgress />
                </Box>
            )
        }
    }

    const handleChange = (event, newType) => {
        setListType(newType);

        if (newType === 0) {
            setCallers(activeCallers);
        } else {
            setCallers(archivedCallers);
        }
    };

    return (
        <>
            <NavBar/>
            <div className="home">
                <Tabs value={listType} onChange={handleChange} aria-label="Change caller list type" className="home-tabs">
                    <Tab label="Active" {...a11yProps(0)} />
                    <Tab label="Archive" {...a11yProps(1)} />
                </Tabs>
                <Content isLoaded/>
            </div>
        </>
    );
}