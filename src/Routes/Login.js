import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name !== '') {
            localStorage.setItem('user', name);
            navigate('/');
        }
    };

    useEffect(() => {
        const clearUser = () => {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            const msUntilEndOfDay = endOfDay - now;
            setTimeout(() => {
                localStorage.removeItem('user');
            }, msUntilEndOfDay);
        };
        clearUser();
    }, []);

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
