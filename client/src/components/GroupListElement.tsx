import React, { useState } from 'react';
import './GroupListElement.css';

import { GroupWithChildren, User } from '../../../shared/types/GroupNode'
import ExpandButton from './ExpandButton';
import UserListElement from './UserListElement';

// Feel free to rename this components

// renders a single group in the expandable list/tree.
const GroupListElement: React.FC<GroupWithChildren> = (props: GroupWithChildren) => {
    const [expanded, setExpanded] = useState(false);
    const childrenArray = props.subGroups ? props.subGroups : [];
    const userArray = props.users ? props.users : [];
    
    return (
        <div>
            {/* this div is our 'li' list element, but we don't want 'li' properties */}
            <div className="groupnode" onClick={() => {setExpanded(!expanded)}}>
                <ExpandButton expanded={expanded} callback={() => setExpanded(!expanded)}/>
                <div className="group-name"> {props.name} </div>
                <div className="group-email"> {props.email} </div>
                <div className="group-addmember-button"> 
                    <a href={"/" + props.id}><button>Add member</button></a>
                </div>
                <div className="group-edit-button"> 
                    <a href={"/edit-group?id=" + props.id}><button>Edit group</button></a>
                </div>
            </div>
            {/* If there are children and they should be expanded, 
            render them in a list (giving an indentation)*/}
            { expanded && childrenArray.length ? 
            <ul className="list sub-list">
                { childrenArray?.map(g => <GroupListElement {...g} />) }
                { userArray.length ? userArray.map(u => <UserListElement {...u} />) : null }
            </ul>
            : null}
        </div>
    )
}

export default GroupListElement;