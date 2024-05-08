/**
 * Home Page Content
*/

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, CircularProgress, InputAdornment, Tab, Tabs, TextField } from '@mui/material';
import { getActiveCallers, getArchivedCallers } from '../api.js';
import { sortCallers } from '../components/utils';
import CardList from "../components/CardList";

import '../styles/routes/Home.css';

function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
}

export default function Home() {
    // State Variables
    const   [listType, setListType] = useState(0),
            [searchQuery, setSearchQuery] = useState(''),
            [filteredCallers, setFilteredCallers] = useState(null);
    // API Variables
    const   activeCallers = useQuery({queryKey: ['active'], queryFn: getActiveCallers}),
            archivedCallers = useQuery({queryKey: ['archive'], queryFn: getArchivedCallers}),
            initialCallers = activeCallers.isSuccess ? sortCallers(activeCallers.data) : [],
            allCallers = [
                activeCallers.isSuccess ? sortCallers(activeCallers.data) : [],
                archivedCallers.isSuccess ? sortCallers(archivedCallers.data) : []
            ];
    // List Type Variables
    const   isType = {
                active: listType === 0,
                archived: listType === 1
            },
            activeType = isType.active ? 'Archived' : 'Active';
    
    // Component Functions
    const handleSearch = (input, type = listType) => {
        const inputText = input.target ? input.target.value : input;
        const searchValue = inputText.trim().toLowerCase();
        let list = allCallers[type];

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

        setFilteredCallers(list);
        setSearchQuery(searchValue);
    }

    const handleTabChange = (event, newType = isType.active ? 1 : 0) => {
        setListType(newType);
        setFilteredCallers(allCallers[newType]);

        if (searchQuery.length > 0) {
            handleSearch(searchQuery, newType);
        }
    };

    // Sub Components
    function Content() {
        if (activeCallers.isLoading) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '500px' }}>
                    <CircularProgress />
                </Box>
            )
        } else if (isType.active ? activeCallers.isError : archivedCallers.isError) {
            return (
                <div className="empty-state">
                    <p>There was an error retrieving caller data.</p>
                </div>
            );
        } else {
            const callers = filteredCallers ? filteredCallers : initialCallers;

            return (
                <>
                    {callers.length > 0 ? (
                        <>
                            <p data-show={callers.length < allCallers[listType].length} className="home-search_results font-body italic">Showing {callers.length} of {allCallers[listType].length}</p>
                            <CardList callers={callers}/>
                        </>
                    ) : (
                       <div className="empty-state">
                            <p>{allCallers[listType].length === 0 ? `There are no ${activeType.toLowerCase()} caller records.` : 'No results matching your search.'}</p>
                            <Button variant="text" disableElevation onClick={handleTabChange}>
                                <span className="font-body-bold">{`Search ${activeType} Callers`}</span>
                            </Button>
                       </div>
                    )}
                </>
            )
        }
    }

    return (
        <div className="home page-padding">
            <h1 className="a11y-text">All Callers</h1>
            <Tabs value={listType} onChange={handleTabChange} aria-label="Change caller list type" className="home-tabs">
                <Tab label="Active" {...a11yProps(0)} />
                <Tab label="Archive" {...a11yProps(1)} />
            </Tabs>
            {isType.active && (
                <div className="home-add">
                    <Button className="button-icon" variant="text" disableElevation href="/new">
                        <span aria-hidden="true" className="material-symbols-outlined">add_circle</span>
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
                    type="search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <img className="card-data_services-logo" src={`${process.env.PUBLIC_URL}/images/icon-search.svg`} alt='washingtonRecoveryHelpLine' title=''/>
                            </InputAdornment>
                        )
                    }}
                />
                {/* Filter by last called date
                    all dates
                    within last 6 months
                    over 6 months ago  

                    and or

                    iconbutton that toggles old only?
                 */}
            </div>
            <Content aria-live="polite" id="content" isLoaded/>
        </div>
    );
}