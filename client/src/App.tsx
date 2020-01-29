import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Groups from './components/Groups';
import Header from './components/Header';
import Sidenav from './components/Sidenav';

const ListView: React.FC = () => {
  return (
      <div className="bottomContainer">
        <Groups/>
      </div>
  );
}
const Login: React.FC = () => {
  return (
    <h1>DU MÅSTE LOGGA IN</h1>
  );
}

const App: React.FC = () => {

  const [sidenavExpanded, setSidenavExpanded] = useState(false)

  return (
    <Router>
      <div className="background">
        <Header expandSidenav={() => setSidenavExpanded(!sidenavExpanded)}/>
        <Sidenav expanded={sidenavExpanded} callback={() => setSidenavExpanded(!sidenavExpanded)}/>

        <Switch>
          <Route exact path="/listview" component={ListView} /> 
          <Route exact path="/login" component={Login} />
        </Switch>

      </div>
    </Router>
  )
}

export default App;
