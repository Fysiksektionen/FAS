import React, { useState }  from 'react';
import { GroupFilled }      from '../../../shared/types/GroupNode'
import ExpandButton         from './ExpandButton';
import UserListElement      from './UserListElement';
import ExternalUserListElement from './ExternalUserListElement';
import './GroupListElement.css';



const GroupListElement: React.FC<GroupFilled> = (props: GroupFilled) => {
    
    const [expanded, setExpanded] = useState(false);
    const hasMembers = props.users.length || props.subGroups.length || props.externalUsers.length

    return (
        <div>
            <div className="groupnode" onClick={() => {setExpanded(!expanded)}}>
                {/* Show expand button if group has members */}
                {hasMembers && 
                    <ExpandButton expanded={expanded} callback={() => setExpanded(!expanded)}/>}
                <div className="group-name"> {props.name} </div>
                <div className="group-email"> {props.email} </div>
                {/* <div className="group-addmember-button"> 
                    <a href={"/" + props.id}><button>Add member</button></a>
                </div> */}
                <div className="group-edit-button"> 
                    <a href={"/groups/" + props.id}><button>Edit group</button></a>
                </div>
            </div>
            {/* If there are children and they should be expanded, 
            render them in a list (giving an indentation)*/}
            { expanded && 
            <ul className="list sub-list">
                { props.subGroups?.map(g => <GroupListElement {...g} />) }
                { props.users?.map(u => <UserListElement {...u} />) }
                { props.externalUsers?.map(m => <ExternalUserListElement {...m} />)}
            </ul>
            }
        </div>
    )
}

export default GroupListElement;