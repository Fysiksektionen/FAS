import React, { useState, useEffect } from 'react';
import { User, Group, Member, GroupFilled, DirectoryMap } from '../../shared/types/GroupNode';

import Frontpage from './components/Frontpage';
import Dashboard from './components/Dashboard';

import './App.css';


export enum httpMethod {get = "get", post = "post", update = "update", delete = "delete"};

export async function APIRequest(APICallName: string, method: httpMethod, body?: string) {
    const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080";
    const resourceUrl = baseURI + '/api/' + APICallName;
    const response = await fetch(resourceUrl, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    });
    if (response.status === 401) return Promise.reject(new Error("Unauthorized"));
    return await response.json();
};

export function getGroupFilled(map: DirectoryMap, group: Group): GroupFilled  {

    const subGroups: GroupFilled[] = [];
    const users: User[] = [];
    const externalUsers: Member[] = [];

    group.users.map(member => {
        users.push(map.users[member.id]);
    });

    group.subGroups.map(member => {
        subGroups.push(getGroupFilled(map, map.groups[member.id]))
    });

    const groupFilled: GroupFilled = {...group, subGroups, users};
    return groupFilled;
};



const App: React.FC = () => {

    const key = "loggedin"
    const [loggedin, setLoggedin] = useState(false);

    useEffect(() => {
        // Local storage used as buffer as the /api/me request is async.
        if(window.sessionStorage.getItem(key) === "true") {
            setLoggedin(true);
        } else {
            setLoggedin(false);
        }

        APIRequest('me', httpMethod.get)
        .then(response => {
            if(response.authenticated) {
                setLoggedin(true);
                window.sessionStorage.setItem(key, "true");
            }
            else {
                setLoggedin(false);
                window.sessionStorage.setItem(key, "false");
            }
        }).catch((e: Error) => {
            setLoggedin(false);
            window.sessionStorage.setItem(key, "false");
        });
    })

    return (
        <div className="background">
            {
                loggedin ? <Dashboard /> : <Frontpage />
                //<Dashboard />
            }
        </div>
    )
}

export default App;
