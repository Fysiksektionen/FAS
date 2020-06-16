import React, { useState } from 'react';
import './GroupNode.css';

import { Group } from '../../../shared/types/GroupNode'
import ExpandButton from './ExpandButton';

// Feel free to rename this components

// renders a single group in the expandable list/tree.
export const GroupNode: React.FC<Group> = (props: Group) => {
    const [expanded, setExpanded] = useState(false)
    const childrenArray = props.subGroups ? props.subGroups : []
    return (
        <div>
            <li className="groupnode" onClick={() => {setExpanded(!expanded)}}>
                <ExpandButton expanded={expanded} callback={() => setExpanded(!expanded)}/>
                <div className="groupname">{props.name}</div>
            </li>
            {/* If there are children and they should be expanded, 
            render them in a list (giving an indentation)*/}
            {expanded && childrenArray && childrenArray.length ? 
            <ul>
                {/* {childrenArray.map((groupNode:GroupNodeResponse) => <GroupNode {...groupNode}/>)} */}
            </ul>
            : null}
        </div>
    )
}