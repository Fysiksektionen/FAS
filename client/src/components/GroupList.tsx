import React, { useState, useEffect } from 'react';
import { APIService } from '../../../shared/types/APIService'
import { GroupNodeResponse } from '../../../shared/types/GroupNode'
import { GroupNode } from './GroupNode'
import Spinner from './Spinner';
import './GroupList.css'



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
                setResult({ status: 'loaded', payload: response.groups })
            })
            .catch(error => setResult({ status: 'error', error }))
    }, [])
    return result
}

export const Groups: React.FC = () => {
    const service = useGetGroupAPI();
    return (
        <div>
            {service.status === 'loading' && <Spinner/>}
            {service.status === 'loaded' && service.payload.map(groupNode => <GroupNode {...groupNode}/>)}
            {service.status === 'error' && <div style={{color:"white"}}>Oops something went wrong, couldn't load groups.</div>}
        </div>
    )
}

export default Groups;