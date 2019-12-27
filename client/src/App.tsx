import React, { useState, useEffect } from 'react';
import './App.css';
import { GroupNode, getGroups, mockGroupResponse }from './components/GroupNode'



const App: React.FC = () => {

  return (
    <div className="App background">
      <div className="topContainer">

      </div>
      <div className="bottomContainer">
        <div className="groupContainer">
          {mockGroupResponse.map(groupNode => <GroupNode {...groupNode}/>)}
        </div>
      </div>
    </div>
  );
}

export default App;
