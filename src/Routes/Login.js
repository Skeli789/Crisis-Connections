import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, setUser } from '../utils/utils';

import '../styles/routes/Login.css';

export default function Login() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = getUser();
        if (user) {
            navigate('/'); // Redirect to home page if user is already logged in
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name !== '') {
            setUser(name); // Save the user
            navigate('/'); // Redirect to home page
            window.location.reload(); // Force a reload to ensure the user is set in local storage
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}
