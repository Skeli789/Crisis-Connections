import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { getLabelName, getUser, removeUser } from "../utils/utils";
import { hotlines } from '../utils/fields';

function LogOut() {
    const navigate = useNavigate();
    
    function logOut() {
        // Remove user from local storage
        removeUser();
        // Redirect to login page
        navigate('/login');
        window.location.reload(); // Force a reload to ensure the user is removed from local storage
    }

    const btn = (
        <Button variant="text" onClick={logOut} disableElevation>
            <span className="font-body-bold">Log out</span>
        </Button>
    );

    return btn;
}

const logos = hotlines.map(hotline => {
    return (
        <img key={hotline} className={`logos-secondary ${hotline}`} src={`${process.env.PUBLIC_URL}/images/logo_${hotline}.svg`} alt={getLabelName(hotline)}/>
    )
});
  
export default function NavBar() {
    const userName = getUser();
    return (
        <nav>
            <div className="logos page-padding">
                <img className="logos-main" alt="Crisis Connections" src={`${process.env.PUBLIC_URL}/images/logo_crisisConnections.svg`}/>
                {logos}
            </div>
            <section className="main page-padding">
                <div className="nav-heading">
                {
                    userName ?
                        <Link to="/">
                            <span className="nav-heading_text font-heading">Frequent Callers</span>
                        </Link>
                    :
                        <Link to="/login">
                            <span className="nav-heading_text font-heading">Login</span>
                        </Link>
                }
                </div>
                {
                    userName &&
                        <div>
                            <span className="font-heading">Welcome, {userName}</span>
                            <LogOut />
                        </div>
                }
            </section>
        </nav>
    );
}