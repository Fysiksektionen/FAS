import React from 'react';
import { APIService } from '../../../shared/types/APIService'
import { DirectoryMap, GroupWithChildren } from '../../../shared/types/GroupNode'
import GroupListElement from './GroupListElement'

import Spinner          from './Spinner';
import ErrorMessage     from './ErrorBox';

import './GroupList.css'



type State = {
    directoryMap: DirectoryMap,
    groupsFiltered: GroupWithChildren[],
    isFiltering: Boolean,
    apiService: APIService<GroupWithChildren[]>
}

class GroupList extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            directoryMap: {} as DirectoryMap,
            groupsFiltered: [] as GroupWithChildren[],
            isFiltering: false,
            apiService: {status: 'loading'}
        }
        // Bind searchbar callback.
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const baseURI = process.env.FAS_BASE_URI || "http://localhost:8080"
        const resourceUrl = baseURI + '/api/directory/map'
        fetch(resourceUrl)
            .then(response => {
                
                if (response.status === 401) {  
                    throw new Error("Unauthorized");
                }
                return response.json()
            })
            .then(response => {
                // Update the directory map.
                this.setState({
                    directoryMap: response
                });
                // To allow filtering and sorting of groups, we create a
                // GroupNodeResponse[]
                var arr = [] as GroupWithChildren[];
                Object.keys(response.groups).forEach(key => {
                    const group: GroupWithChildren = {
                        id: response.groups[key].id,
                        name: response.groups[key].name,
                        email: response.groups[key].email,
                        description: response.groups[key].description,
                        nonEditableAliases: [],
                        subGroups: [],
                        users: []
                    }
                    arr.push(group);
                });

                this.setState({
                    apiService: {
                        status: 'loaded',
                        payload: arr
                    },
                    groupsFiltered: arr
                });
            })
            .catch((error: Error) => {
                if (error.message === "Unauthorized") {
                    this.setState({ 
                        apiService: {
                            status: 'unauthorized'
                        }
                    });
                }
                else
                {
                    this.setState({ 
                        apiService: {
                            status: 'error',
                            error: error 
                        }
                    });
                }
            });
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {

        let currentList = this.state.apiService.status === 'loaded' ? this.state.apiService.payload : [] as GroupWithChildren[];
        let newList = [] as GroupWithChildren[];

        this.setState({
            isFiltering: (e.target.value.length >= 2)
        });

        // If search bar not empty
        if (this.state.isFiltering) {

            newList = currentList.filter(item => {
                const filterWord = e.target.value.toLowerCase();
                return item.name.toLowerCase().includes(filterWord) 
                       || item.email.toLowerCase().includes(filterWord);
            });
        }
        // Search bar is empty, so display original list
        else {
            newList = currentList;
        }
        // Update filtered state.
        this.setState({
            groupsFiltered: newList
        });
    }   

    render() {
    return (
        <div className="grouplist">

            <a href="/add-group"><button>Add group</button></a>
            <input type="text" placeholder="Search..." name="searchbar" id="searchbar" onChange={this.handleChange}></input>
            <p>Found {this.state.groupsFiltered?.length} group(s)</p>

            <hr></hr>

            <div className="list">
                {this.state.apiService.status === 'loading' && <Spinner/>}
                {this.state.apiService.status === 'loaded' && this.state.groupsFiltered.map(g => <GroupListElement {...g} />)}
                {this.state.apiService.status === 'unauthorized' && <ErrorMessage message="Unauthorized"/>}
                {this.state.apiService.status === 'error' && <ErrorMessage message="Error: failed to load groups"/>}
            </div>
        </div>
    )}
}

export default GroupList;