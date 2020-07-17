import React from 'react';
import { Member } from '../../../shared/types/GroupNode'
import './ExternalUserListElement.css';



const ExternalUserListElement: React.FC<Member> = (props: Member) => {
    return (
        <div className="userlist-element">
            <div className="user-name"> {""} </div>
            <div className="user-email"> {props.email} </div>
        </div>
    )
}

export default ExternalUserListElement;