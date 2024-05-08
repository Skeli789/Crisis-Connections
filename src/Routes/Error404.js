import { Button } from "@mui/material";

import '../styles/routes/Error404.css';

export default function Login() {
    return (
        <div className="error-page page-padding">
            <div className="empty-state">
                <h1 className="font-page-heading">Page Not Found</h1>
                <p className="font-body">The page you are looking for does not exist.</p>
                <Button variant="text" disableElevation href="/">
                    <span className="font-body-bold">Return Home</span>
                </Button>
            </div>
        </div>
    )
}