import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Frontpage from './components/Frontpage';
import Dashboard from './components/Dashboard';

import './App.css';



const App: React.FC = () => {

    const [loggedin, setLoggedin] = useState(false);

    useEffect(() => {
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/me'
        fetch(resourceUrl)
        .then(response => response.json())
        .then(response => {
            if(response.authenticated) {
                setLoggedin(true)
            }
        })
    })

    return (
        <div className="background">
            {loggedin ? <Dashboard /> : <Frontpage />}
        </div>
    )
}

export default App;
