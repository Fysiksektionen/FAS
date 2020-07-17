import React, { useRef } from 'react';
import { APIService } from '../../../shared/types/APIService'
import { APIRequest, httpMethod } from '../App'
import Cross from './Cross'
import './UserCreate.css'

type Props = {
    closeCallback: Function
}

export const UserCreate: React.FC<Props> = (props: Props) => {
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    // TODO: add APIservice and wait for response
    //const [result, setResult] = useState<APIService<>>({ status: 'loading'});

    return (
        <div className="usercreate">
            <div className="usercreate-inner">
                <Cross onClick={() => props.closeCallback()}/>
                <h2>Create new user</h2>
                <label>First name</label><br />
                <input type="text" id="familyName" placeholder="Jane..." ref={firstNameRef}/><br />
                <label>Last name</label><br />
                <input type="text" id="givenName" placeholder="Doe..." ref={lastNameRef}/><br />
                <label>Email</label><br />
                <input type="text" id="email" placeholder="jane.doe..." ref={emailRef}/>  @fysiksektionen.se
                <br />

                <button onClick={() => { APIRequest("directory/createuser", httpMethod.post, 
                    JSON.stringify({name: { familyName: lastNameRef.current?.value, 
                                            givenName: firstNameRef.current?.value },
                                    email: emailRef.current?.value }))}}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default UserCreate;
