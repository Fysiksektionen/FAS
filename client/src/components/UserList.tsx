import React from 'react';
import { APIService } from '../../../shared/types/APIService'
import { User, DirectoryMap } from '../../../shared/types/GroupNode';

import Spinner          from './Spinner';
import ErrorMessage     from './ErrorBox';

import './UserList.css'
import UserListElement from './UserListElement';
import QuickSort, { CompareFunction } from '../QuickSort';


type State = {
    directoryMap: DirectoryMap,
    usersFiltered: User[],
    apiService: APIService<User[]>
    isFiltering: boolean,
    sortedAs: string, // should probably be replaced with enum type
}

class UserList extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            directoryMap: {} as DirectoryMap,
            usersFiltered: [] as User[],
            apiService: {status: 'loading'},
            isFiltering: false,
            sortedAs: 'default'
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


    sortListWith(compare: CompareFunction<User>) {
        let array = this.state.usersFiltered;
        let low = 0;
        let high = array.length-1;
        QuickSort(array, low, high, compare);

        // not really needed since 'sortedAs', gets updated.
        /*this.setState({
            groupsFiltered: array
        });*/
    }
    sortListBy(sortName: string, compareAscending: CompareFunction<User>, compareDescending: CompareFunction<User>) {
        if(this.state.sortedAs ===  sortName + ' Ascending') {
            this.sortListWith(compareDescending);
            this.setState({ sortedAs: sortName + ' Descending' });
        } else {
            this.sortListWith(compareAscending);
            this.setState({ sortedAs: sortName + ' Ascending' });
        }
    }
    sortByName() {
        this.sortListBy('Name',
            (u1, u2) => u1.name.fullName.localeCompare(u2.name.fullName),
            (u1, u2) => u2.name.fullName.localeCompare(u1.name.fullName));
    }
    sortByEmail() {
        this.sortListBy('Email',
            (u1, u2) => u1.email.localeCompare(u2.email),
            (u1, u2) => u2.email.localeCompare(u1.email));
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
                <br />
                <button className="sort-button" onClick={()=>this.sortByName()}>Sort by name</button>
                <button className="sort-button" onClick={()=>this.sortByEmail()}>Sort by email</button>

                <p>Found {this.state.usersFiltered?.length} group(s)</p>

                <hr></hr>

                <div className="list">


                    {/* test, to be removed */}
                    <UserListElement {...dummyUser} />


                    {this.state.apiService.status === 'loading' && <Spinner/>}
                    {this.state.apiService.status === 'unauthorized' && <ErrorMessage message="Unauthorized"/>}
                    {this.state.apiService.status === 'error' && <ErrorMessage message="Error: failed to load users"/>}
                    {this.state.apiService.status === 'loaded' && 
                        this.state.usersFiltered.map(user => 
                            <UserListElement {...user} />
                        )
                    }
                </div>
            </div>
        )}
}

export default UserList;