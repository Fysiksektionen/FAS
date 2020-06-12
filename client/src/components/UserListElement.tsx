import React from 'react';
import './UserListElement.css';

import { User } from '../../../shared/types/GroupNode';

const UserListElement: React.FC<User> = (props: User) => {
    return (
        /* this div is our 'li' list element, but we don't want 'li' properties */
        <div className="userlist-element">
            <a href={"/users?id=" + props.id}>
                <span className="user-name"> {props.name.fullName} </span>
                <span className="user-email"> {props.email} </span>
                <span className="user-edit-button"> <button>Edit User</button> </span>
                
            </a>
            
        </div>
    )
}

export default UserListElement