import React, { useState, useEffect } from 'react';
import { APIService } from '../../../shared/types/APIService'
import { TreeItem, Group, DirectoryMap } from '../../../shared/types/GroupNode'

import Tree from 'react-d3-tree';
import Spinner from './Spinner'
import ErrorMessage from './ErrorBox'

import './GroupTree.css';



const useGetGroupAPI = () => {
    const [result, setResult] = useState<APIService<TreeItem>>({
        status: 'loading'
    });
    useEffect(() => {
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/directory/map'
        fetch(resourceUrl)
            .then(response => response.json())
            .then((response: DirectoryMap) => {
                setResult({ status: 'loaded', payload: convertToGraph(response.groups) })
            })
            .catch(error => {setResult({ status: 'error', error })})
    }, [])
    return result;
}

const convertToGraph = (groups: {[id: string]: Group}) => {

    const TreeItems: {[id: string]: TreeItem} = {};

    for (const id in groups) {
        const group = groups[id];

        // Register parents property
        for (const subMember of group.subGroups) {
            const parents = groups[subMember.id].parents
            groups[subMember.id].parents = parents ? [...parents, id] : [id];
        }

        // Create all nodes
        const node : TreeItem = {
            name: group.name,
            attributes: {
                "Users": JSON.stringify(group.users.length)
            },
            _collapsed: true
        }
        TreeItems[id] = node;
    }

    // Connect children
    for (const id in TreeItems) {
        const node = TreeItems[id];
        const group = groups[id];
        node.children = group.subGroups.map(subMember => TreeItems[subMember.id]);
    }

    const roots: TreeItem[] = [];
    for (const id in groups) {
        const group = groups[id];
        if (!group.parents) roots.push(TreeItems[id]);
    }

    const n : TreeItem = {
        name: "Fysiksektionen",
        children: roots,
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