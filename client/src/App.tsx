import React, { useState, useEffect } from 'react';
import './App.css';
import { Groups } from './components/Groups'



const App: React.FC = () => {

  return (
    <div className="App background">
      <div className="topContainer">

      </div>
      <div className="bottomContainer">
        <Groups/>
      </div>
    </div>
  );
}

export default App;
