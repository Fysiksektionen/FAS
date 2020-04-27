import React from 'react';
import './UserAction.css';
import UserActionRequest, {ActionProps} from './UserAction';

const { useRef } = React

export const EditUser: React.FC<ActionProps> = (props: ActionProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const kthidRef = useRef<HTMLInputElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    // Get user info prefilled

    return <div className="panel">
        <h1><div className="close-cross" onClick={()=>props.closeCallback()} />
            Ändra användare
        </h1>
        <label>Namnet på användaren</label>
        <input type="text" id="userName" placeholder="Namnet på användaren" ref={nameRef}/><br />
        <label>KTH ID</label>
        <input type="text" id="kthid" placeholder="KTH ID" ref={kthidRef}/><br />

        <button onClick={() => { UserActionRequest("edituser", responseRef, JSON.stringify({userid: props.objectID, userName: nameRef.current?.value, kthid: kthidRef.current?.value}))} }>
            Ändra
        </button>
        <div ref={responseRef}></div>
    </div>
}

export default EditUser;
