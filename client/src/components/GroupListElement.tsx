import React, { useState } from 'react';
import './GroupListElement.css';

import { GroupWithChildren } from '../../../shared/types/GroupNode'
import ExpandButton from './ExpandButton';

// Feel free to rename this components

// renders a single group in the expandable list/tree.
const GroupListElement: React.FC<GroupWithChildren> = (props: GroupWithChildren) => {
    const [expanded, setExpanded] = useState(false)
    const childrenArray = props.subGroups ? props.subGroups : []
    return (
        <div>
            <li className="groupnode" onClick={() => {setExpanded(!expanded)}}>
                <ExpandButton expanded={expanded} callback={() => setExpanded(!expanded)}/>
                <div className="group-name"> {props.name} </div>
                <div className="group-email"> {props.email} </div>
                <div className="group-addmember-button"> 
                    <a href={"/" + props.id}><button>Add member</button></a>
                </div>
                <div className="group-edit-button"> 
                    <a href={"/edit-group?id=" + props.id}><button>Edit group</button></a>
                </div>
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

export default GroupListElement;