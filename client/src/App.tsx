import React, { useState } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Groups from './components/Groups';
import Header from './components/Header';
import Sidenav from './components/Sidenav';
import GraphView from './components/GraphView'

const ListView: React.FC = () => {
  return (
      <div className="content">
        <Groups/>
      </div>
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
          <Route exact path="/graphview" component={GraphView} />
        </Switch>

      </div>
    </Router>
  )
}

export default App;
