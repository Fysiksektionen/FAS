import React from 'react';
import './UserAction.css';
import UserActionRequest, {ActionProps} from './UserAction';

const { useRef } = React

export const EditGroup: React.FC<ActionProps> = (props: ActionProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    // Get user info prefilled

    return <div className="panel">
        <h1><div className="close-cross" onClick={()=>props.closeCallback()} />
            Ändra grupp
        </h1>
        <label>Namnet på gruppen</label>
        <input type="text" id="groupName" placeholder="Namnet på gruppen" ref={nameRef}/><br />
        <label>Alias</label>
        <input type="text" id="alias" placeholder="Alias" ref={aliasRef}/><br />

        <button onClick={() => { UserActionRequest("editgroup", responseRef, JSON.stringify({userid: props.objectID, groupName: nameRef.current?.value, alias: aliasRef.current?.value}))} }>
            Ändra
        </button>
        <div ref={responseRef}></div>
    </div>
}

export default EditGroup;
