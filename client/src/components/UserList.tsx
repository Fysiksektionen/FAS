import React from 'react';
import { APIService } from '../../../shared/types/APIService'
import { User, DirectoryMap } from '../../../shared/types/GroupNode';

import Spinner          from './Spinner';
import ErrorMessage     from './ErrorBox';

import './UserList.css'




type State = {
    directoryMap: DirectoryMap,
    usersFiltered: User[],
    apiService: APIService<User[]>
    isFiltering: boolean
}

class UserList extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            directoryMap: {} as DirectoryMap,
            usersFiltered: [] as User[],
            apiService: {status: 'loading'},
            isFiltering: false
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
                // To allow filtering and sorting of users, we create a User[] list
                var arr = [] as User[];
                Object.keys(response.users).forEach(key => {
                    arr.push(response.users[key]);
                });
                this.setState({
                    apiService: {
                        status: 'loaded',
                        payload: arr
                    },
                    usersFiltered: arr
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

        let currentList = this.state.apiService.status === 'loaded' ? 
                          this.state.apiService.payload : [] as User[];
        let newList = [] as User[];

        this.setState({
            isFiltering: (e.target.value.length >= 2)
        });

        // If search bar not empty
        if (this.state.isFiltering) {

            newList = currentList.filter(item => {
                const filterWord = e.target.value.toLowerCase();
                return item.name.fullName.toLowerCase().includes(filterWord) 
                       || item.email.toLowerCase().includes(filterWord);
            });
        }
        // Search bar is empty, so display original list
        else {
            newList = currentList;
        }
        // Update filtered state.
        this.setState({
            usersFiltered: newList
        });
    }   

    render() {
        
        const dummyUser: User = {
            id: "5",
            name: {fullName: "The dummy user"},
            email: "blobb@fysiksektionen.se",
            role: "???",
            type: "????",
            status: "suspended",
            isAdmin: false,
            lastLoginTime: "",
            creationTime: "",
            orgUnitPath: ""
        }

    return (
        <div className="userlist">

            <a href="/add-user"><button>Add user</button></a>
            <input type="text" placeholder="Search..." name="searchbar" id="searchbar" onChange={this.handleChange}></input>
            <p>Found {this.state.usersFiltered?.length} group(s)</p>

            <hr></hr>

            <div className="list">



                <div className="userlist-element">
                    <a href={"/users?id=" + dummyUser.id}>
                        <h3>{dummyUser.name.fullName}</h3>
                    </a>
                </div>

                {this.state.apiService.status === 'loading' && <Spinner/>}
                {this.state.apiService.status === 'unauthorized' && <ErrorMessage message="Unauthorized"/>}
                {this.state.apiService.status === 'error' && <ErrorMessage message="Error: failed to load users"/>}
                {this.state.apiService.status === 'loaded' && 
                    this.state.usersFiltered.map(user => 
                        <div className="userlist-element">
                            <a href={"/users?id=" + user.id}>
                                <h3>{user.name.fullName}</h3>
                            </a>
                            
                        </div>
                    )
                }
            </div>
        </div>
    )}
}

export default UserList;