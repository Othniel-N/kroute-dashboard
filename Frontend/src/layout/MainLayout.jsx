import React, { useState, useEffect } from 'react';
import './main-layout.scss';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import TopNav from '../components/topnav/TopNav';

const MainLayout = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Check if the user is already logged in on component mount
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        if (storedLoginStatus === 'true') {
            setLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        // Check if the username and password match the credentials for the admin user
        if (username === 'admin' && password === 'admin') {
            setLoggedIn(true);
            // Store the login status in localStorage
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        // Remove the login status from localStorage on logout
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <>
            {!isLoggedIn && (
                <div className="login-container">
                    <h2>
                        Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}

            {isLoggedIn && (
                <>
                    <Sidebar handleLogout={handleLogout} />
                    <div className="main">
                        <div className="main__content">
                            <TopNav />
                            <Outlet />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MainLayout;