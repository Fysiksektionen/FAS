import React from 'react';
import { User } from '../../../shared/types/GroupNode';
import './UserListElement.css';

    

const UserListElement: React.FC<User> = (props: User) => {
    return (
        <div className={"userlist-element " + (props.isAdmin ? "admin" : "")} onClick={
            () => window.location.href = "/users/" + props.id
        }>
            <div className="user-name"> {props.name.fullName} </div>
            <div className="user-email"> {props.primaryEmail} </div>
            <button className="user-edit-button">Edit User</button>
        </div>
    )
}

export default UserListElement;