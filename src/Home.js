/**
 * Home Page Content
*/

import { useEffect, useState } from 'react';

import CardList from "./components/CardList";
import NavBar from "./components/NavBar";

// https://app.json-generator.com/
const apiKey = 'z1439pyatt1xjy2bug8y7ttt7piedbwx4o0n54gr';
const fakeData = `https://api.json-generator.com/templates/5B2bJ0QIu25x/data?access_token=${apiKey}`;

export default function Home() {
    const [callers, setCallers] = useState([]);

    useEffect(() => {
        fetch(fakeData, {
          method: "GET"
        }).then((response) => response.json())
          .then((data) => {
            const callerList = data.map(caller => {
                return ( {
                    callHistory: caller.callHistory.sort((a,b) => b.dateTime - a.dateTime),
                    ...caller
                })
            }).sort((a,b) => { return b.callHistory[0].dateTime - a.callHistory[0].dateTime });

            setCallers(callerList);

          }).catch((error) => console.log(error));
      }, []);

    return (
        <div className="home">
            <NavBar/>
            <CardList callers={callers}/>
        </div>
    );
}
