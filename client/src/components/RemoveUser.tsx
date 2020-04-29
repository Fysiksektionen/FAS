import React from 'react';
import './UserAction.css';
import UserActionRequest, {ActionProps} from './UserAction';

const { useRef } = React

export const RemoveUser: React.FC<ActionProps> = (props: ActionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);
    return <div className="panel">
        <h1><div className="close-cross" onClick={()=>props.closeCallback()} />
            Ta bort användare
        </h1>
        <label>Namnet på användaren</label>
        <input type="text" id="userName" placeholder="Namnet på användaren" ref={inputRef}/><br />

        <button onClick={() => { UserActionRequest("removeuser", responseRef, JSON.stringify({userid: props.objectID, userName: inputRef.current?.value}))} }>
            Ta bort
        </button>
        <div ref={responseRef}></div>
    </div>
}

export default RemoveUser;
