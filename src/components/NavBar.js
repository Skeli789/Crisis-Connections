import Button from '@mui/material/Button';

function LogOut() {
    const btn = (
        <Button variant="contained" disableElevation>
            Log out
        </Button>
    );
    
    const isSignedIn = true; // Replace with SSO info

    return isSignedIn ? btn : null;
}
  
export default function NavBar() {
    return (
        <nav>
            <h1>Frequent Callers</h1>
            <LogOut />
        </nav>
    );
}