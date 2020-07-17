import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header       from './Header';
import Sidenav      from './Sidenav';
import UserList     from './UserList';
import UserEdit     from './UserEdit';
import GroupList    from './GroupList';
import GroupTree    from './GroupTree';
import GroupEdit    from './GroupEdit';
import './Dashboard.css';



/**
 * TODO: documentation
 * 
 * 
 */
const Dashboard: React.FC = () => {

    const [sidenavExpanded, setSidenavExpanded] = useState(false);

    // This hook can be used by child components to set the header pageTitle property.
    const [pageTitle, setPageTitle] = useState("Dashboard");
    
    return (
        <Router>
            <Header expandSidenav={() => setSidenavExpanded(!sidenavExpanded)} pageTitle={pageTitle}/>
            <Sidenav expanded={sidenavExpanded} callback={() => setSidenavExpanded(!sidenavExpanded)}/>
            
            <div className="content">
                <Switch>
                    <Route       path="/users/:id"  component={UserEdit} />
                    <Route exact path="/users"      component={UserList} />
                    <Route       path="/groups/:id" component={GroupEdit} />
                    <Route exact path="/groups"     component={GroupList} /> 
                    <Route exact path="/grouptree"  component={GroupTree} />
                    <Route path="/*"><Redirect to="/" /></Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Dashboard;