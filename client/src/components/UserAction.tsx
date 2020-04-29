import React, { useEffect } from 'react';
import './UserAction.css';

export type ActionProps = {
    closeCallback: Function,
    objectID: any
}

// calls the api function 'APICallName' with data 'JSONdata'. HTMLRefMessage is reference to HTML object to write response message to.
// used with the, add, move, remove - components
export const UserActionRequest = (APICallName: string, HTMLRefMessage: React.RefObject<HTMLDivElement>, JSONdata: string) => {
    const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080";
    const resourceUrl = baseURI + '/api/'+APICallName;
    fetch(resourceUrl, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSONdata
        })
        .then(res => res.json())
        .then(
            (result) => {
                if(null != HTMLRefMessage && null != HTMLRefMessage.current) {
                    HTMLRefMessage.current.innerHTML = result.message;
                    HTMLRefMessage.current.className = "response";
                }
            })
            .catch((error) => {
                if(null != HTMLRefMessage && null != HTMLRefMessage.current) {
                    HTMLRefMessage.current.innerHTML = "Ett fel inträffade!";
                    HTMLRefMessage.current.className = "response";
                    console.log(error);
                }
            })
        
}

export default UserActionRequest;