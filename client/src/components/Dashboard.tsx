import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Header       from './Header';
import Sidenav      from './Sidenav';
import GroupList    from './GroupList';
import GroupTree    from './GroupTree';

import './Dashboard.css';



const Dashboard: React.FC = () => {

    const [sidenavExpanded, setSidenavExpanded] = useState(false);
    
    return (
        <Router>
            <Header expandSidenav={() => setSidenavExpanded(!sidenavExpanded)}/>
            <Sidenav expanded={sidenavExpanded} callback={() => setSidenavExpanded(!sidenavExpanded)}/>
            <div className="content">
                <Switch>
                    <Route exact path="/grouplist" component={GroupList} /> 
                    <Route exact path="/grouptree" component={GroupTree} />
                    <Route path="/*"><Redirect to="/" /></Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Dashboard;