import React, { useState, useEffect } from 'react';
import { APIService } from '../../../shared/types/APIService'
import { TreeItem } from '../../../shared/types/GroupNode'

import Tree from 'react-d3-tree';
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'

import './GroupTree.css';



const useGetGroupAPI = () => {
    const [result, setResult] = useState<APIService<TreeItem>>({
        status: 'loading'
    });
    useEffect(() => {
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/map'
        fetch(resourceUrl)
            .then(response => response.json())
            .then(response => {
                setResult({ status: 'loaded', payload: convertToGraph(response.groups) })
            })
            .catch(error => {setResult({ status: 'error', error })})
    }, [])
    return result;
}

const convertToGraph = (groups: any) => {
    let graph : TreeItem[] = [];
    let users : string[] = [];
    let subGroups : string[] = [];

    // Create all nodes
    for (const key in groups)
    {
        const n : TreeItem = {
          name: groups[key].name,
          attributes: {
              "MemberCount": JSON.stringify(groups[key].directMembersCount)
          }
        }
        graph.push(n)
    }

    // Duplicate to populate children
    // graph.forEach(p => {
    //     p.children
    // });
    

    let n : TreeItem = {
        name: "Fysiksektionen",
        children: graph,
        _collapsed: true
    }

    return n as TreeItem;
}
  
const GroupTree: React.FC = () => {
    const service = useGetGroupAPI();
    
    return (
        <div className="groupTree">
            {service.status === 'loading' && <Spinner />}
            {service.status === 'loaded' && <Tree data={service.payload} useCollapseData={true} orientation="vertical"/>}
            {service.status === 'error' && <ErrorMessage message="Failed to load groups" />}
        </div>
        );
}

export default GroupTree;