import React, { useState, useEffect } from 'react';
import { APIService } from '../../../shared/APIService'
import { GroupNodeResponse } from '../../../shared/types/GroupNode'
import { GroupNode } from './GroupNode'
import './Groups.css'

// *Custom* react hook, intro to hooks: https://reactjs.org/docs/hooks-intro.html
// custom hooks: https://reactjs.org/docs/hooks-custom.html
const useGetGroupAPI = () => {
    // initialise state result with a Service taking a list of GroupNodeResponse with status loading
    const [result, setResult] = useState<APIService<GroupNodeResponse[]>>({
        status: 'loading'
    })
    useEffect(() => {
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/groups'
        fetch(resourceUrl)
            .then(response => response.json())
            .then(response => {
                setResult({ status: 'loaded', payload: response })
            })
            .catch(error => setResult({ status: 'error', error }))
    }, [])
    return result
}

export const Groups: React.FC = () => {
    const service = useGetGroupAPI();
    return (
        <div className="groupContainer">
            {service.status === 'loading' && <div className="spinloading"/>}
            {service.status === 'loaded' && service.payload.map(groupNode => <GroupNode {...groupNode}/>)}
            {service.status === 'error' && <div style={{color:"white"}}>Oops something went wrong, couldn't load groups.</div>}
        </div>
    )
}

export default Groups;