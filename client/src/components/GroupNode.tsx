import React, { Component, useState } from 'react';
import './GroupNode.css';

import { GroupNodeResponse } from '../../../shared/types/GroupNode'
import ExpandButton from './ExpandButton';

export function getGroups(): Promise<GroupNodeResponse[]> {
    return fetch("http://localhost:8080/api/groups")
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(data => data as GroupNodeResponse[])
}

// Feel free to rename this components

// renders a single group in the expandable list/tree.
export const GroupNode: React.FC<GroupNodeResponse> = (props: GroupNodeResponse) => {
    const [expanded, setExpanded] = useState(false)
    const childrenArray = props.children ? props.children : []
    return (
        <div>
            <li className="groupnode">
                <ExpandButton expanded={expanded} callback={() => setExpanded(!expanded)}/>
                <div className="groupname">{props.name}</div>
            </li>
            {/* If there are children and they should be expanded, 
            render them in a list (giving an indentation)*/}
            {expanded && childrenArray && childrenArray.length ? 
            <ul>
                {childrenArray.map((groupNode:GroupNodeResponse) => <GroupNode {...groupNode}/>)}
            </ul>
            : null}
        </div>
    )
}

// for testing
export const mockFdevGroup : GroupNodeResponse =  {name:"F.dev"}
export const mockGroupResponse : GroupNodeResponse[] = [{name:"Fcom",children:[mockFdevGroup]}, {name:"FKM"}]

