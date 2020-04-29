import React from 'react';
import './UserAction.css';
import UserActionRequest, {ActionProps} from './UserAction';

const { useRef } = React

export const CreateUser: React.FC<ActionProps> = (props: ActionProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const kthidRef = useRef<HTMLInputElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    return <div className="panel">
        <h1><div className="close-cross" onClick={()=>props.closeCallback()} />
            Lägg till användare
        </h1>
        <label>För- och efternamn på användaren</label>
        <input type="text" id="userName" placeholder="Namnet på användaren" ref={nameRef}/><br />
        <label>KTH-id</label>
        <input type="text" id="kthid" placeholder="KTH-id" ref={kthidRef}/><br />

        <button onClick={() => { UserActionRequest("createuser", responseRef, JSON.stringify({userid: props.objectID, groupName: nameRef.current?.value, alias: kthidRef.current?.value}))} }>
            Lägg till
        </button>
        <div ref={responseRef}></div>
    </div>
}

export default CreateUser;
