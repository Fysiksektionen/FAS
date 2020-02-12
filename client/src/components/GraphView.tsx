import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import './GraphView.css';

const myTreeData = [
    {
      name: 'Top Level',
      attributes: {
        keyA: 'val A',
        keyB: 'val B',
      },
      children: [
        {
          name: 'Level 2: A',
          attributes: {
            keyA: 'val A',  
            keyB: 'val B',
            keyC: 'val C',
          },
        },
        {
          name: 'Level 2: B',
        },
        {
          name: 'Level 2: B',
        },
        {
          name: 'Level 2: B',
        },
        {
          name: 'Level 2: B',
        },
        {
          name: 'Level 2: B',
        },
        {
          name: 'Level 2: B',
        }
      ],
    },
  ];
  
const GraphView: React.FC = () => {

  const [pos, setPos] = useState({x: 600, y: 200})

  // let treeComponent = React.Component<>
    
  
  
  return (
    <div className="content">
      <Tree data={myTreeData} orientation="horizontal" translate={pos}/>
      <button onClick={() => setPos({x: 600, y:200})}>Reset</button>
    </div>
  );
}

export default GraphView;