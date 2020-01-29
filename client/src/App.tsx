import React, { useState, useEffect } from 'react';
import './App.css';
import Groups from './components/Groups';
import Header from './components/Header';
import Sidenav from './components/Sidenav';

const App: React.FC = () => {
  const [sidenavExpanded, setSidenavExpanded] = useState(false)
  return (
    <div className="background">

      <Header expandSidenav={() => setSidenavExpanded(!sidenavExpanded)}/>
      <Sidenav expanded={sidenavExpanded} callback={() => setSidenavExpanded(!sidenavExpanded)}/>
        
      <div className="topContainer">
      </div>
      <div className="bottomContainer">
        <Groups/>
      </div>
    </div>
  );
}

export default App;
