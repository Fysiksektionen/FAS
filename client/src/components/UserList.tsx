import React from 'react';
import { APIRequest, httpMethod } from '../App';
import { APIService } from '../../../shared/types/APIService'
import { User, DirectoryMap } from '../../../shared/types/GroupNode';
import Spinner          from './Spinner';
import ErrorMessage     from './ErrorBox';
import UserListElement from './UserListElement';
import QuickSort, { CompareFunction } from '../QuickSort';
import './UserList.css'
import UserCreate      from './UserCreate';


type State = {
    directoryMap: DirectoryMap,
    usersFiltered: User[],
    apiService: APIService<User[]>
    currentFilterWord: string,
    isFiltering: boolean,
    filterName: boolean, 
    filterEmail: boolean,
    sortedAs: string,               // TODO: replace with enum type
    showUserCreateForm: boolean
}

class UserList extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            directoryMap: {} as DirectoryMap,
            usersFiltered: [] as User[],
            apiService: {status: 'loading'},
            currentFilterWord: '',
            isFiltering: false,
            filterName: true, 
            filterEmail: true,
            sortedAs: 'default',
            showUserCreateForm: false
        }
        // Bind searchbar callback.
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        APIRequest("directory/map", httpMethod.get).then(res => {
            // To allow filtering and sorting, we create a User[] list
            var arr = [] as User[];
            Object.keys(res.users).forEach(key => {
                arr.push(res.users[key]);
            });
            this.setState({
                directoryMap: res,
                apiService: {
                    status: 'loaded',
                    payload: arr
                },
                usersFiltered: arr
            });
        }).catch((e: Error) => {
            if (e.message === "Unauthorized")
                this.setState({ apiService: {status: 'unauthorized'} });
            else
                this.setState({ apiService: {status: 'error', error: e} });
        });
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let currentList = this.state.apiService.status === 'loaded' ? this.state.apiService.payload : [] as User[];
        let newList = [] as User[];
        let oldWord = this.state.currentFilterWord;
        let newWord = e.target.value;
        let isFiltering = (e.target.value.length >= 2);

        this.setState({
            currentFilterWord: newWord,
            isFiltering: isFiltering
        });

        // If search bar not empty
        if (isFiltering) {
            const filterWord = e.target.value.toLowerCase();
            
            // check if searched list is enough (reuse the list)
            if(newWord.startsWith(oldWord)) {
                currentList = this.state.usersFiltered;
            }
            
            // check what to filter
            if(this.state.filterName) {
                if(this.state.filterEmail) { // filter both name and email
                    newList = currentList.filter(item => 
                            item.name.fullName.toLowerCase().includes(filterWord) 
                            || item.primaryEmail.includes(filterWord)); // assume email to be lowercase
                }
                else { // filter name, not email
                    newList = currentList.filter(item => item.name.fullName.toLowerCase().includes(filterWord));
                }
            }
            else if(this.state.filterEmail) { // filter email, not name
                newList = currentList.filter(item => item.primaryEmail.includes(filterWord)); // assume email to be lowercase
            }
            else {
                // reset
                this.setState({filterName: true});
            }
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
            (u1, u2) => u1.primaryEmail.localeCompare(u2.primaryEmail),
            (u1, u2) => u2.primaryEmail.localeCompare(u1.primaryEmail));
    }


    render() {
        return (
            <div className="userlist">

                <a onClick={() => this.setState({showUserCreateForm: true})}><button className="btn-large">Create user</button></a>
                <input type="text" placeholder="Search..." name="searchbar" id="searchbar" onChange={this.handleChange}></input>
                
                <input className="input-checkbox" id="checkbox_name" type="checkbox" checked={this.state.filterName} onChange={()=>this.setState({filterName: !this.state.filterName})}/>
                <label className="checkbox" htmlFor="checkbox_name">
                    <span><svg width="12px" height="10px" viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg></span>
                    <span>Search by name</span>
                </label>
                <input className="input-checkbox" id="checkbox_email" type="checkbox" checked={this.state.filterEmail} onChange={()=>this.setState({filterEmail: !this.state.filterEmail})}/>
                <label className="checkbox" htmlFor="checkbox_email">
                    <span><svg width="12px" height="10px" viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg></span>
                    <span>Search by email</span>
                </label>

                <br />
                <button className="btn-blue" onClick={()=>this.sortByName()}>Sort by name</button>
                <button className="btn-blue" onClick={()=>this.sortByEmail()}>Sort by email</button>

                <p>Found {this.state.usersFiltered?.length} user(s)</p>

                <hr></hr>

                <div className="list">
                    {this.state.apiService.status === 'loading' && <Spinner/>}
                    {this.state.apiService.status === 'unauthorized' && <ErrorMessage message="Unauthorized"/>}
                    {this.state.apiService.status === 'error' && <ErrorMessage message="Failed to load users"/>}
                    {this.state.apiService.status === 'loaded' && 
                        this.state.usersFiltered.map(user => 
                            <UserListElement {...user} />
                        )
                    }
                </div>
                
                {/* Show Create User-window if toggled */}
                {this.state.showUserCreateForm ? <UserCreate closeCallback={() => this.setState({showUserCreateForm: false})} /> : null}

            </div>
        )}
}

export default UserList;