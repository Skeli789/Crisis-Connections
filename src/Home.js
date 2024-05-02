/**
 * Home Page Content
*/

import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';


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
    const [allCallers, setAllCallers] = useState([]);

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
            const archivedCallers = callerList.filter(caller => caller.archived.isArchived);
            // setActiveCallers(activeCallers);
            // setArchivedCallers(archivedCallers);
            setAllCallers([activeCallers, archivedCallers]);
            setCallers(activeCallers);
            setIsLoaded(true);
            // setOptions([getOptions(activeCallers), getOptions(archivedCallers)]);
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
        setCallers(allCallers[newType]);
    };

    const handleSearch = (input) => {
        const searchValue = input.target.value.trim().toLowerCase();
        let list = allCallers[listType];

        // Todo: clean this up or move to utils or something...
        if (input) {
            list = allCallers[listType].filter(card => {
                const callerName = `${card.firstName} ${card.lastName}`.trim().toLowerCase();
                const isNameMatch = callerName?.includes(searchValue);
                const searchNums = searchValue.match(/\d/g);
                const searchValueNum = searchNums ? (searchValue.includes('+1') && searchNums.length > 10 ? searchValue.replace('+1', '') : searchValue).replace(/\D/g,'') : null;
            
                const isPhoneMatch = card.phoneNumbers.some(number => {
                    return searchNums ? number.toString().includes(searchValueNum) : false;
                });
                const isAkaMatch = card.aka.some(detail => detail.toLowerCase().includes(searchValue));
    
                return isNameMatch || isPhoneMatch || isAkaMatch;
            })
        }

        setCallers(list);
    }

    return (
        <>
            <NavBar/>
            <div className="home">
                <Tabs value={listType} onChange={handleChange} aria-label="Change caller list type" className="home-tabs">
                    <Tab label="Active" {...a11yProps(0)} />
                    <Tab label="Archive" {...a11yProps(1)} />
                </Tabs>
                <div className="home-search">
                    <TextField
                        id="input-with-icon-textfield"
                        label="Search by name OR phone number"
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img className="card-data_services-logo" src={`./images/icon-search.svg`} alt='washingtonRecoveryHelpLine' title=''/>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <Content isLoaded/>
            </div>
        </>
    );
}