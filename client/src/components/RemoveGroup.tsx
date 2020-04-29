import React from 'react';
import './UserAction.css';
import UserActionRequest, {ActionProps} from './UserAction';

const { useRef } = React

export const RemoveGroup: React.FC<ActionProps> = (props: ActionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);
    return <div className="panel">
        <h1><div className="close-cross" onClick={()=>props.closeCallback()} />
            Ta bort grupp
        </h1>
        <label>Namnet på gruppen</label>
        <input type="text" id="groupName" placeholder="Namnet på gruppen" ref={inputRef}/><br />

        <button onClick={() => { UserActionRequest("removegroup", responseRef, JSON.stringify({userid: props.objectID, groupName: inputRef.current?.value}))} }>
            Ta bort
        </button>
        <div ref={responseRef}></div>
    </div>
}

export default RemoveGroup;
