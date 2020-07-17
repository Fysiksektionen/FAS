import React from 'react';
import { APIService } from '../../../shared/types/APIService'
import { DirectoryMap, Group } from '../../../shared/types/GroupNode'
import GroupListElement from './GroupListElement'
import Spinner          from './Spinner';
import ErrorMessage     from './ErrorBox';
import GroupCreate      from './GroupCreate';
import QuickSort, {CompareFunction} from '../QuickSort'
import { APIRequest, httpMethod, getGroupFilled } from '../App';
import './GroupList.css'



type State = {
    directoryMap: DirectoryMap,
    groupsFiltered: Group[],
    currentFilterWord: string,
    isFiltering: boolean,
    filterName: boolean,
    filterEmail: boolean,
    sortedAs: string,                   // TODO: replace with enum type
    apiService: APIService<Group[]>,
    showGroupCreateForm: boolean
}

class GroupList extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            directoryMap: {} as DirectoryMap,
            groupsFiltered: [] as Group[],
            currentFilterWord: '',
            isFiltering: false,
            filterName: true, 
            filterEmail: true,
            sortedAs: 'default',
            apiService: {status: 'loading'},
            showGroupCreateForm: false
        }
        // Bind searchbar callback.
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        APIRequest("directory/map", httpMethod.get).then(res => {
            var arr = [] as Group[];
            Object.keys(res.groups).forEach(key => {
                arr.push(res.groups[key])
            });
            this.setState({
                directoryMap: res,
                apiService: {
                    status: 'loaded',
                    payload: arr
                },
                groupsFiltered: arr
            });
        }).catch((error: Error) => {
            if (error.message === "Unauthorized")
                this.setState({ apiService: {status: 'unauthorized'} });
            else
                this.setState({ apiService: {status: 'error', error: error} });
        });
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        /** Ideas to effectivate the search:
         * 
         * 1. All 2 character combinations ([A-z 0-9]=1444), are stored in a hashmap. Each node that has the combination are in associated list.
         * 
         * 2. If the user continues to type,
         *      either don't search until stopped writing,
         *      or save the search and run it on the new list. (onChange is called in order, at least for now)
         * 
         * 3. ???
         */


        let currentList = this.state.apiService.status === 'loaded' ? this.state.apiService.payload : [] as Group[];
        let newList = [] as Group[];
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
                currentList = this.state.groupsFiltered;
            }
            
            // check what to filter
            if(this.state.filterName) {
                if(this.state.filterEmail) { // filter both name and email
                    newList = currentList.filter(item => 
                            item.name.toLowerCase().includes(filterWord) 
                            || item.email.includes(filterWord)); // assume email to be lowercase
                }
                else { // filter name, not email
                    newList = currentList.filter(item => item.name.toLowerCase().includes(filterWord));
                }
            }
            else if(this.state.filterEmail) { // filter email, not name
                newList = currentList.filter(item => item.email.includes(filterWord)); // assume email to be lowercase
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
            groupsFiltered: newList
        });
    }   


    sortListWith(compare: CompareFunction<Group>) {
        let array = this.state.groupsFiltered;
        let low = 0;
        let high = array.length-1;
        QuickSort(array, low, high, compare);
    }
    sortListBy(sortName: string, compareAscending: CompareFunction<Group>, compareDescending: CompareFunction<Group>) {
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
            (g1, g2) => g1.name.localeCompare(g2.name),
            (g1, g2) => g2.name.localeCompare(g1.name));
    }
    sortByEmail() {
        this.sortListBy('Email',
            (g1, g2) => g1.email.localeCompare(g2.email),
            (g1, g2) => g2.email.localeCompare(g1.email));
    }
    sortByGroupCount() {
        this.sortListBy('GroupCount',
            (g1, g2) => g1.subGroups.length - g2.subGroups.length,
            (g1, g2) => g2.subGroups.length - g1.subGroups.length);
    }
    sortByUserCount() {
        this.sortListBy('UserCount',
            (g1, g2) => g1.users.length - g2.users.length,
            (g1, g2) => g2.users.length - g1.users.length);
    }


    render() {
    return (
        <div className="grouplist">

            <a onClick={() => this.setState({showGroupCreateForm: true})}><button className="btn-large">Create group</button></a>

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
            <button className="btn-blue" onClick={()=>this.sortByGroupCount()}>Sort by subgroup count</button>
            <button className="btn-blue" onClick={()=>this.sortByUserCount()}>Sort by user count</button>

            <p>Found {this.state.groupsFiltered?.length} group(s)</p>

            <hr></hr>

            <div className="list">
                {this.state.apiService.status === 'loading' && <Spinner/>}
                {this.state.apiService.status === 'loaded' && this.state.groupsFiltered.map(g => 
                    <GroupListElement {...getGroupFilled(this.state.directoryMap, g)} />
                )}
                {this.state.apiService.status === 'unauthorized' && <ErrorMessage message="Unauthorized"/>}
                {this.state.apiService.status === 'error' && <ErrorMessage message="Failed to load groups"/>}
            </div>

            {/* Show Create Group-window if toggled */}
            {this.state.showGroupCreateForm ? <GroupCreate closeCallback={() => this.setState({showGroupCreateForm: !this.state.showGroupCreateForm})} /> : null}

        </div>
    )}
}

export default GroupList;
