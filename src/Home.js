/**
 * Home Page Content
*/

import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import CardList from "./components/CardList";
import NavBar from "./components/NavBar";

// https://app.json-generator.com/
const apiKey = 'z1439pyatt1xjy2bug8y7ttt7piedbwx4o0n54gr';
const fakeData = `https://api.json-generator.com/templates/5B2bJ0QIu25x/data?access_token=${apiKey}`;

export default function Home() {
    const [callers, setCallers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch(fakeData, {
          method: "GET"
        }).then((response) => response.json()).then((data) => {
            const callerList = data.map(caller => {
                return ({
                    callHistory: caller.callHistory.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)),
                    ...caller
                })
            }).sort((a,b) => new Date(b.callHistory[0].dateTime) - new Date(a.callHistory[0].dateTime));

            setCallers(callerList);
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

    return (
        <div className="home">
            <NavBar/>
            <Content isLoaded/>
        </div>
    );
}