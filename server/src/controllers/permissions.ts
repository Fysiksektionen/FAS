import { group } from "console";
import { Group, Member, User } from "../../../shared/types/GroupNode";

enum PermsType {
    ADMIN,
    EDITOR,
    VIEWER,
    //DENY  // could be a group to add for deny all things
}

enum Action {
    VIEW = 1<<0,
    ADD = 1<<1,
    EDIT = 1<<2,
    REMOVE = 1<<3,
    ANY = -1,
    NONE = 0
}

enum Target {
    ASSIGNED_GROUP = 1<<0,
    ASSIGNED_MEMBER = 1<<2, // is this even a thing?
    ASSIGNED_USER = 1<<3,
    ASSIGNED_ANY = ASSIGNED_GROUP | ASSIGNED_MEMBER | ASSIGNED_USER,
    ALL_GROUPS = (1<<4) | ASSIGNED_GROUP,
    ALL_MEMBERS = (1<<5) | ASSIGNED_MEMBER,
    ALL_USERS = (1<<6) | ASSIGNED_USER,
    ALL_ANY = ALL_GROUPS | ALL_MEMBERS | ALL_USERS,
    NONE = 0
}

interface Permission {
    action: Action;
    target: Target;
}

const adminPermissions : Permission[] = [{action: Action.ANY, target: Target.ALL_ANY}]
const editorPermissions : Permission[] = [{action: Action.ANY, target: Target.ASSIGNED_ANY}]
const viwerPermissions : Permission[] = [{action: Action.VIEW, target: Target.ALL_GROUPS}]

function getPermissionsForType(type: PermsType) : Permission[] {
    const test = adminPermissions;
    switch(type) {
        case PermsType.ADMIN:
            return adminPermissions;
        case PermsType.EDITOR:
            return editorPermissions;
        case PermsType.VIEWER:
            return viwerPermissions;
    }
}

class PermsUser {
    username: string; // email id.
    assignedGroupsID: string[]; // could make a object containing every permission for every group.
    assignedUserID: string[]; // could make a object containing every permission for every group.
    type: PermsType;

    public isAdmin() : boolean {
        return this.type == PermsType.ADMIN;
    }
    public isEditor() : boolean {
        return this.type == PermsType.EDITOR;
    }
    public isViewer() : boolean {
        return this.type == PermsType.VIEWER;
    }

    public getPermissions() {
        return getPermissionsForType(this.type);
    }
}


let PermsUsers: {[username: string] : PermsUser} = {}


function getPermsUserFromUsername(username: string) : PermsUser {
    return PermsUsers[username];
}


// might replace with string id version
export const hasPermissionToAddGroupToGroup = (user: PermsUser, parent: Group, child: Group) : boolean => {
    if(hasPermission3(user, Action.ADD, Target.ALL_GROUPS)) {
        return true;
    }

    if(hasPermission3(user, Action.ADD, Target.ASSIGNED_GROUP)) {
        // true, if child is assigned to the user, and the parent is also assigned to the user - i.e. do not modify parent if not able to
        return user.assignedGroupsID.includes(child.id) && user.assignedGroupsID.includes(parent.id);
    }
    return false;
}

// might replace with string id version
export const hasPermissionToAddUserToGroup = (user: PermsUser, parent: Group, child: User) : boolean => {
    if(hasPermission3(user, Action.ADD, Target.ALL_USERS)) {
        return true;
    }
    
    if(hasPermission3(user, Action.ADD, Target.ASSIGNED_USER)) {
        // true, if child is assigned to the user, and the parent is also assigned to the user
        return user.assignedUserID.includes(child.id) && user.assignedGroupsID.includes(parent.id);
    }
    return false;
}

// not needed?
//export const hasPermissionToAddMemberToGroup = (user: PermsUser, parent: Group, child: Member) : boolean => {}


// private, should be used with caution, since it doesn't care for what group the action is applied to
const hasPermission = (user : PermsUser, permission : Permission) : boolean => {
    const userPerms = user.getPermissions();

    if(permission.action == Action.NONE || permission.target == Target.NONE) {
        return false; // or true? it is weird to request none.
    }

    let allowed = false;
    for(let i = 0; i < userPerms.length; i++) {
        let current_perm = userPerms[i];
        
        if((permission.action & current_perm.action) != permission.action) { // if all actions are not in their rights. (if requesting something else)
            continue;
        }

        if((permission.target & current_perm.target) != permission.target) { // if all targets are not in their rights. (if requesting something else)
            continue;
        }

        allowed = true;
        break;
    }

    return allowed;
}
// private, should be used with caution, since it doesn't care for what group the action is applied to
const hasPermission3 = (user : PermsUser, action: Action, target: Target) : boolean => hasPermission(user, {action: action, target: target})


export const makeAdmin = (user : PermsUser) => {
    user.type = PermsType.ADMIN;
    // do with mongoose
}

export const makeEditor = (user : PermsUser) => {
    user.type = PermsType.EDITOR;
    // do with mongoose
}

export const removeRole_SetViewer = (user : PermsUser, new_type : PermsType) => {
    user.type = PermsType.VIEWER;
    // do with mongoose
}


export const isUserAbleToLogin = (username: string) => {
    let permUser = getPermsUserFromUsername(username);

    if(permUser) { // not undefined
        return permUser.type === PermsType.ADMIN || permUser.type === PermsType.EDITOR;
    }
    return false;
}


// run at start
export const initPermissions = () => {
    // do with mongoose
    PermsUsers = {};
}
