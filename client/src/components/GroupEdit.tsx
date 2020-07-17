import React from 'react';
import { APIRequest, httpMethod } from '../App';
import { APIService } from '../../../shared/types/APIService'
import { DirectoryMap, Group } from '../../../shared/types/GroupNode'
import DialogConfirm   from './DialogConfirm';
import Spinner  from './Spinner';
import ErrorMessage     from './ErrorBox';
import GroupListElement from './GroupListElement';
import UserListElement  from './UserListElement';
import { RouteProps } from 'react-router';
import './GroupEdit.css'



type State = {
    id: string,
    apiService: APIService<DirectoryMap>,
    group: Group,
    showDeleteDialog: boolean,
    deleteDialogOpts: any
}

class GroupEdit extends React.Component<RouteProps, State> {

    constructor(props: {}) {
        super(props);
        //@ts-ignore
        const groupID = this.props.match.params.id;
        this.state = { 
            id: groupID,
            apiService: {status: 'loading'},
            group: {} as Group,
            showDeleteDialog: false,
            deleteDialogOpts: {
                title: "Delete group",
                message: "Are you sure you want to delete the group? This action cannot be undone.",
                buttons: [
                    {
                        label: "Confirm",
                        onClick: () => {
                            APIRequest('directory/deletegroup', httpMethod.delete, JSON.stringify({
                                groupKey: groupID
                            })).then(res => {
                                // TODO: handle response
                            })    
                        }
                    },
                    {
                        label: "Cancel",
                        onClick: () => this.setState({showDeleteDialog: !this.state.showDeleteDialog})
                    }
                ]
            }
        }
    }

    componentDidMount() {
        APIRequest("directory/map", httpMethod.get).then(res => {
            this.setState({
                group: res.groups[this.state.id] as Group,
                apiService: {status: "loaded", payload: res as DirectoryMap}
            })
        }).catch((e: Error) => { this.setState({ apiService: {status: "error", error: e} }) })
    }

    render() {
    return (
        <div className="groupedit">
        {this.state.apiService.status === 'loading' && <Spinner/>}
        {this.state.apiService.status === 'error' && <ErrorMessage message="Failed to load group"/>}
        {this.state.apiService.status === 'loaded' &&      
        <div>  
            <div className="groupedit-panel">
                <h1>{this.state.group.name}</h1>
                <p>{this.state.group.email}</p>
                <h3>Aliases</h3>
                {this.state.group.nonEditableAliases.map(g => <p>{g}</p>)}
                <button>Change name</button>
                <button className="btn-red" onClick={() => this.setState({showDeleteDialog: true})}>Delete group</button> 
            </div>
            <div className="groupedit-panel">
                <h3>Members</h3>
                <button>Add member</button>
                <p>Found {this.state.group.users.length} user(s)
                    and {this.state.group.subGroups.length} group(s)</p>
                <hr></hr>
                <div className="groupedit-memberlist">
                    {this.state.group.users.map(member => 
                        //@ts-ignore - We're certain apiService is 'loaded'
                        <UserListElement {...this.state.apiService.payload.users[member.id]}/>
                    )}
                    {this.state.group.subGroups.map(member => 
                        //@ts-ignore - We're certain apiService is 'loaded'
                        <GroupListElement {...this.state.apiService.payload.groups[member.id]}/>
                    )}
                </div>
            </div>

            {/* Show Delete-group dialog if toggled */}
            {this.state.showDeleteDialog ? <DialogConfirm {...this.state.deleteDialogOpts}/> : null}
        </div>
        }
        </div>
    )}                   
}

export default GroupEdit;