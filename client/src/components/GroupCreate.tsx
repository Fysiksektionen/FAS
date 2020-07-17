import React, { useState, useRef } from 'react';
import { APIService } from '../../../shared/types/APIService'
import { APIRequest, httpMethod } from '../App'

import './GroupCreate.css'

import Cross from './Cross'



type Props = {
    closeCallback: Function
}

export const GroupCreate: React.FC<Props> = (props: Props) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    // TODO: add APIservice and wait for response
    // const [result, setResult] = useState<APIService<>>({ status: 'loading'});

    return (
        <div className="groupcreate">
            <div className="groupcreate-inner">
                <Cross onClick={() => props.closeCallback()}/>
                <h2>Create new group</h2>
                <label>Name</label><br />
                <input type="text" id="name" placeholder="My group..." ref={nameRef}/><br />
                <label>Primary email</label><br />
                <input type="text" id="email" placeholder="" ref={emailRef}/> @fysiksektionen.se
                <br />
                <label>Description</label><br />
                <input type="text" id="desc" placeholder="" ref={descRef}/><br />

                <button onClick={() => { APIRequest("directory/creategroup", httpMethod.post, 
                    JSON.stringify({name: nameRef.current?.value, email: emailRef.current?.value, 
                                    description: descRef.current?.value}))}}>
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default GroupCreate;