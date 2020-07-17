import React from 'react';
import { APIRequest, httpMethod, getGroupFilled } from '../App';
import { APIService } from '../../../shared/types/APIService'
import { DirectoryMap, User, Group } from '../../../shared/types/GroupNode'
import { RouteProps } from 'react-router';
import DialogConfirm   from './DialogConfirm';
import Spinner  from './Spinner';
import ErrorMessage     from './ErrorBox';
import './UserEdit.css'
import GroupListElement from './GroupListElement';



type State = {
    id: string,
    apiService: APIService<DirectoryMap>,
    user: User,
    groups: Group[],
    showDeleteDialog: boolean,
    deleteDialogOpts: any
}

class UserEdit extends React.Component<RouteProps, State> {

    constructor(props: {}) {
        super(props);
        //@ts-ignore
        const userID = this.props.match.params.id;
        this.state = { 
            id: userID,
            apiService: {status: 'loading'},
            user: {} as User,
            groups: [] as Group[],
            showDeleteDialog: false,
            deleteDialogOpts: {
                title: "Delete user",
                message: "Are you sure you want to delete the user? This action cannot be undone.",
                buttons: [
                    {
                        label: "Confirm",
                        onClick: () => {
                            APIRequest('directory/deleteuser', httpMethod.delete, JSON.stringify({
                                groupKey: userID
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
        };
    }

    componentDidMount() {
        APIRequest("directory/map", httpMethod.get).then(res => {
            // Filter out all groups that this user belongs to.
            const arr = [] as Group[];
            Object.keys(res.groups).forEach(key => {
                const group = res.groups[key] as Group;
                if (group.users.some(m => m.id === this.state.id)) {
                    arr.push(res.groups[key])
                }
            });
            this.setState({
                user: res.users[this.state.id] as User,
                groups: arr,
                apiService: {status: "loaded", payload: res as DirectoryMap}
            })
        }).catch((e: Error) => { this.setState({ apiService: {status: "error", error: e} }) })
    }

    render() {
    return (
        <div className="useredit">
        {this.state.apiService.status === 'loading' && <Spinner/>}
        {this.state.apiService.status === 'error' && <ErrorMessage message="Failed to load user"/>}
        {this.state.apiService.status === 'loaded' &&      
        <div>    
            <div className="useredit-panel">
            <h1>{this.state.user.name.fullName}</h1>
                <p>{this.state.user.primaryEmail}</p>
                {this.state.user.isAdmin ? <p id="adminlabel">Administrator</p> : null}
                <table>
                    <tr>
                        <td>Last login:</td>
                        <td>{new Date(this.state.user.lastLoginTime).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Creation time:</td>
                        <td>{new Date(this.state.user.creationTime).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Organization unit:</td>
                        <td>{this.state.user.orgUnitPath}</td>
                    </tr>
                </table>
                {/* Hide edit controls on admin users */}
                {!this.state.user.isAdmin &&
                <div>
                    <button>Change name</button>
                    <button className="btn-red" onClick={() =>
                        this.setState({showDeleteDialog: true})
                    }>Delete user</button>
                </div>}
            </div>
            <div className="useredit-panel">
                <h2>Membership</h2>
                {this.state.groups.length > 0 ? 
                    <div>
                    <p>This user is a member of the following {this.state.groups.length} group(s):</p>
                    {this.state.groups.map(g => 
                        //@ts-ignore - We're certain apiService is 'loaded'
                        <GroupListElement {...getGroupFilled(this.state.apiService.payload, g)} /> )}
                    </div>
                : <p>This user is not in any group.</p>}
            </div>
            {/* Show Delete-group dialog if toggled */}
            {this.state.showDeleteDialog ? <DialogConfirm {...this.state.deleteDialogOpts}/> : null}
        </div>
        }           
        </div> 
    )}
}

export default UserEdit;