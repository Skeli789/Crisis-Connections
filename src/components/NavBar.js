import Button from '@mui/material/Button';
import { getLabelName } from "./utils";

function LogOut() {
    const btn = (
        <Button variant="text" disableElevation>
            Log out
        </Button>
    );
    
    const isSignedIn = true; // Replace with SSO info

    return isSignedIn ? btn : null;
}

const hotlines = [
    "988KingCounty",
    "washingtonTeenLink",
    "washingtonRecoveryHelpLine",
    "washingtonWarmLine",
    "crisisServices",
    "211KingCounty",
    "washingtonSupportAfterSuicide"
];

const logos = hotlines.map(hotline => {
    return (
        <img key={hotline} className={`logos-secondary ${hotline}`} src={`./images/logo_${hotline}.svg`} alt={getLabelName(hotline)}/>
    )
});

// make svg component?
  
export default function NavBar() {
    return (
        <nav>
            <div className="logos">
                <img className="logos-main" alt="Crisis Connections" src='./images/logo_crisisConnections.svg'/>
                {logos}
            </div>
            <section className="main">
                <h1>Frequent Callers</h1>
                <LogOut />
            </section>
        </nav>
    );
}