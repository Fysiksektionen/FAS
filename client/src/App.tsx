import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Frontpage from './components/Frontpage';
import Dashboard from './components/Dashboard';

import './App.css';



const App: React.FC = () => {

    const key = "loggedin"
    const [loggedin, setLoggedin] = useState(false);

    useEffect(() => {
        if(window.sessionStorage.getItem(key) === "true") {
            setLoggedin(true);
        } else {
            setLoggedin(false);
        }

        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/me'
        fetch(resourceUrl)
        .then(response => response.json())
        .then(response => {
            if(response.authenticated) {
                setLoggedin(true);
                window.sessionStorage.setItem(key, "true");
            }
            else {
                setLoggedin(false);
                window.sessionStorage.setItem(key, "false");
            }
        })
    })

    return (
        <div className="background">
            {
                loggedin ? <Dashboard /> : <Frontpage />
            }
        </div>
    )
}

export default App;
