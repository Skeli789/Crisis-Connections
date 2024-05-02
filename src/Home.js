/**
 * Home Page Content
*/

import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
    const [searchQuery, setSearchQuery] = useState('');

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

            setAllCallers([activeCallers, archivedCallers]);
            setCallers(activeCallers);
            setIsLoaded(true);
        }).catch((error) => console.log(error));
    }, []);

    function addNewCaller() {
        console.log('add new caller');
    }

    function Content() {
        if (isLoaded) {
            return (
                <>
                    {callers.length > 0 ? (
                        <>
                            <p data-show={callers.length < allCallers[listType].length} className="home-search_results font-body-italic">Showing {callers.length} of {allCallers[listType].length}</p>
                            <CardList callers={callers}/>
                        </>
                    ) : (
                       <div className="home-emptystate">
                            <p>{allCallers[listType].length === 0 ? 'There are no active caller records.' : 'No results matching your search.'}</p>
                            <Button variant="text" disableElevation onClick={handleTabChange}>
                                {`Search ${isType.active ? 'Archived' : 'Active'} Callers`}
                            </Button>
                       </div>
                    )}
                </>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                    <CircularProgress />
                </Box>
            )
        }
    }

    const handleTabChange = (event, newType = isType.active ? 1 : 0) => {
        setListType(newType);
        setCallers(allCallers[newType]);

        if (searchQuery.length > 0) {
            handleSearch(searchQuery, newType);
        }
    };

    const handleSearch = (input, type = undefined) => {
        const inputText = input.target ? input.target.value : input;
        const searchValue = inputText.trim().toLowerCase();
        let list = allCallers[type === undefined ? listType : type];

        // Todo: clean this up or move to utils or something...
        if (input) {
            list = list.filter(card => {
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
        setSearchQuery(searchValue);
    }

    const isType = {
        active: listType === 0,
        archived: listType === 1
    };

    return (
        <>
            <NavBar/>
            <div className="home">
                <Tabs value={listType} onChange={handleTabChange} aria-label="Change caller list type" className="home-tabs">
                    <Tab label="Active" {...a11yProps(0)} />
                    <Tab label="Archive" {...a11yProps(1)} />
                </Tabs>
                {isType.active && (
                    <div className="home-add">
                        <Button className="button-icon" variant="text" disableElevation onClick={addNewCaller}>
                            <span aria-hide="true" class="material-symbols-outlined">add_circle</span>
                            <span className="font-body-bold">add new caller</span>
                        </Button>
                    </div>
                )}
                <div className="home-search">
                    <TextField
                        aria-controls="content"
                        id="input-with-icon-textfield"
                        label="Search by name OR phone number"
                        fullWidth
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
                <Content aria-live="polite" id="content" isLoaded/>
            </div>
        </>
    );
}