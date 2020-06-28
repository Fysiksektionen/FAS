
import { admin_directory_v1 } from 'googleapis';
import { as } from './asyncUtil';
import { basicDict } from '../../../shared/types/common';
import { Group, User, Member } from '../../../shared/types/GroupNode';
import { defaultMemberFields, defaultGroupFields, defaultUserFields } from '../../../shared/types/Fields';
import { allDomains } from '../credentials';

interface cGroup extends admin_directory_v1.Schema$Group {
    subGroups: Member[];
    users: Member[];
    externalUsers: Member[];
}
interface cUser extends admin_directory_v1.Schema$User {

}

export default class DirectoryApi extends admin_directory_v1.Admin {
    
    private Cgroups: {[id: string]: cGroup};
    private Cusers: {[id: string]: cUser};
    private cached: boolean = false;
    private readonly defaultRequestOpts = {
        domain: this.domain,
        maxResults: 500,
    };



    constructor(public domain: string, opts: Partial<admin_directory_v1.Options>) {
        super({version: 'directory_v1', ...opts});
        this.Cgroups = {};
        this.Cusers = {};
    }

    /**
     * Returns a JSON map of all users and groups in the G Suite organizaion.
     * @param opts 
     */
    public async getMap(opts?: basicDict, noCache = false) {

        if (!this.cached || noCache) {
            const [err, groups] = await as(this.listGroups(opts));
            if (err) return Promise.reject(err);
            const [err2, users] = await as(this.listUsers(opts));
            if (err2) return Promise.reject(err2);

            this.Cusers = {};
            for (const user of users) {
                this.Cusers[user.id] = user;
            }

            const memberPromises = groups.map(async (group: Partial<cGroup>) => {
                const [err3, members] = await as(this.listMembers(group.id));
                if (err3 || !members) return Promise.reject(err3);
                
                group.subGroups = members.filter(member => member.type === 'GROUP').map(subGroup => {
                    const parsedSubGroup: Partial<Member> = {};
                    for (const field of defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedSubGroup[field] = subGroup[field];
                    }
                    return parsedSubGroup as Member;
                });
                group.users = members.filter(member => member.type === 'USER' && !!this.Cusers[member.id]).map(user => {
                    const parsedUser: Partial<Member> = {};
                    for (const field of defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedUser[field] = user[field];
                    }
                    return parsedUser as Member;
                });
                group.externalUsers = members.filter(member => member.type === 'USER' && !this.Cusers[member.id]).map(externalUser => {
                    const parsedExternalUser: Partial<Member> = {};
                    for (const field of defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedExternalUser[field] = user[field];
                    }
                    return parsedExternalUser as Member;
                });
                return Promise.resolve(group as cGroup);
            });
            const [errAll, mappedGroups] = await as(Promise.all(memberPromises));
            if (errAll) return Promise.reject({mesg: "listMembers", error: errAll});
            
            this.Cgroups = {};
            for (const group of mappedGroups) {
                this.Cgroups[group.id] = group;
            }
            this.cached = true;
        }

        const responseGroups: {[id: string]: Group} = {};
        for (const id in this.Cgroups) {
            const Cgroup = this.Cgroups[id];
            const group: Partial<Group> = {};
            for (const field of defaultGroupFields) {
                //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                group[field] = Cgroup[field];
            }
            responseGroups[id] = group as Group;
        }

        const responseUsers: {[id: string]: User} = {};
        for (const id in this.Cusers) {
            const Cuser = this.Cusers[id];
            const user: Partial<User> = {};
            for (const field of defaultUserFields) {
                //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                user[field] = Cuser[field];
            }
            responseUsers[id] = user as User;
        }

        return {
            groups: responseGroups,
            users: responseUsers
        };
    }

    public async listGroups(opts?: basicDict): Promise<admin_directory_v1.Schema$Group[]> {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.list(opts));
        if (err) return Promise.reject(err);

        const groups = res.data.groups;

        if (res.data.nextPageToken) {
            const [err, nextGroups] = await as(this.listGroups({...opts, pageToken: res.data.nextPageToken}));
            if (err) return Promise.reject(err);
            groups.push(...nextGroups);
        }
        return groups;
    }

    public async listMembers(groupKey: string, opts?: basicDict): Promise<admin_directory_v1.Schema$Member[]> {
        opts = {...this.defaultRequestOpts, ...opts, groupKey};

        const [err, res] = await as(this.members.list(opts));
        if (err) return Promise.reject(err);

        const members = res.data.members;
        
        if (res.data.nextPageToken) {
            const [err, nextMembers] = await as(this.listMembers(groupKey, {...opts, pageToken: res.data.nextPageToken}));
            if (err) return Promise.reject(err);
            members.push(...nextMembers);
        }
        return members || [];
    }

    public async listUsers(opts?: basicDict): Promise<admin_directory_v1.Schema$User[]> {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.users.list(opts));
        if (err) return Promise.reject(err);

        const users = res.data.users;

        if (res.data.nextPageToken) {
            const [err, nextUsers] = await as(this.listUsers({...opts, pageToken: res.data.nextPageToken}));
            if (err) return Promise.reject(err);
            users.push(...nextUsers);
        }
        return users;
    }



    public async createGroup(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.insert(opts));
        if (err) return Promise.reject(err);

        // success
        const group = res.data;
        this.Cgroups[group.id] = {subGroups: [], users: [], externalUsers: []}; // set new empty group in cache

        return group;
    }

    public async deleteGroup(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.delete(opts));
        if (err) return Promise.reject(err);

        // success
        const groupIdToRemove = opts.groupKey as string;
        const emptyResponse = res.data;
        delete this.Cgroups[groupIdToRemove]; // remove group in cache
        for (const id in this.Cgroups) {      // remove all entires with this id
            const groupElements = this.Cgroups[id].subGroups;
            for(let i = 0; i < groupElements.length; i++) { // check each subgroup and remove
                if(groupElements[i].id === groupIdToRemove) { // member.id is the same as groupId
                    delete groupElements[i];
                }
            }
        }

        return emptyResponse;
    }

    public async editGroupInfo(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.patch(opts));
        if (err) return Promise.reject(err);

        // success
        const group = res.data;
        this.Cgroups[group.id].email = group.email;
        this.Cgroups[group.id].name = group.name;
        this.Cgroups[group.id].description = group.description;

        return group;
    }


    public async addAliasToGroup(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.aliases.insert(opts));
        if (err) return Promise.reject(err);

        // success
        const groupKey = opts.groupKey as string;
        const alias = opts.alias as string;
        this.Cgroups[groupKey].aliases.push(alias);
        const alias_res = res.data;

        return alias_res;
    }

    public async removeAliasFromGroup(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.groups.aliases.delete(opts));
        if (err) return Promise.reject(err);

        // success
        const groupKey = opts.groupKey as string;
        const alias = opts.alias as string;
        const index = this.Cgroups[groupKey].aliases.indexOf(alias);
        delete this.Cgroups[groupKey].aliases[index];
        const void_ = res.data;

        return void_;
    }


    public async addMember(opts: basicDict, email: string) {
        opts = {...this.defaultRequestOpts, ...opts};

        // check if adding an email that exist on domain, else it is an external user and google will take care of that.
        let isExternal = true;
        for(let i = 0; i < allDomains.length; i++) {
            if(email.endsWith(allDomains[i])) {
                isExternal = false;
                if(!(this.checkIfEmailExistInCache(email, false) || this.checkIfEmailExistInCache(email, true))) {
                    Promise.reject("No such user/group")
                }
            }
        }
        

        const [err, res] = await as(this.members.insert(opts));
        if (err) return Promise.reject(err);

        // success
        const groupKey = opts.groupKey as string;
        const group = this.Cgroups[groupKey];
        const memberResponse = res.data;
        // ID of memeber is the id of the group/user
        const member : Member = {id: memberResponse.id, email: memberResponse.email, role: memberResponse.role, delivery_settings: memberResponse.delivery_settings};
        const isGroup = this.isAGroupID(memberResponse.id);
        if(isExternal)
            group.externalUsers.push(member);
        else if(isGroup) 
            group.subGroups.push(member);
        else
            group.users.push(member);

        return memberResponse;
    }

    public async removeMember(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.members.delete(opts));
        if (err) return Promise.reject(err);
        
        // success
        const groupKey = opts.groupKey as string;
        const group = this.Cgroups[groupKey];
        const memberKey = opts.memberKey as string;
        const isGroup = this.isAGroupID(memberKey);
        const isUser = this.isAUserID(memberKey);
        const findMemberIndex = (e:Member) => e.id === memberKey;
        if(isGroup) {
            const index = group.subGroups.findIndex(findMemberIndex)
            delete group.subGroups[index];
        }
        else if(isUser) {
            const index = group.users.findIndex(findMemberIndex);
            delete group.users[index];
        }
        else {
            const index = group.externalUsers.findIndex(findMemberIndex);
            delete group.externalUsers[index];
        }
        
        const void_ = res.data;

        return void_;
    }

    public async editMember(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.members.patch(opts));
        if (err) return Promise.reject(err);

        // success
        const member = res.data;
        const parentID = opts.groupKey as string;
        const parent = this.Cgroups[parentID];
        const isGroup = this.isAGroupID(member.id);
        const isUser = this.isAUserID(member.id);
        let memberList;
        if(isGroup) {
            memberList = parent.subGroups;
        }
        else if(isUser) {
            memberList = parent.users;
        }
        else {
            memberList = parent.externalUsers;
        }

        for(let i = 0; i < memberList.length; i++) {
            if(memberList[i].id === member.id) {
                memberList[i].role = member.role;
                memberList[i].delivery_settings = member.delivery_settings;
            }
        }

        return member;
    }


    public async createUser(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.users.insert(opts));
        if (err) return Promise.reject(err);

        // success
        const user = res.data;
        this.Cusers[user.id] = user;

        return user;
    }

    public async deleteUser(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.users.delete(opts));
        if (err) return Promise.reject(err);

        // success
        const userKey = opts.userKey as string;
        delete this.Cusers[userKey];
        for (const id in this.Cgroups) {      // remove all entires with this id
            const users = this.Cgroups[id].users;
            for(let i = 0; i < users.length; i++) { // check each user and remove
                if(users[i].id === userKey) {
                    delete users[i];
                }
            }
        }

        const void_ = res.data;
        
        return void_;
    }

    public async editUser(opts: basicDict) {
        opts = {...this.defaultRequestOpts, ...opts};

        const [err, res] = await as(this.users.update(opts)); // don't use patch for performance in just this instance
        if (err) return Promise.reject(err);

        // success
        const user = res.data;
        this.Cusers[user.id] = user; // as normal google user

        return user;
    }


    checkIfEmailExistInCache(email: string, isGroup: boolean) : boolean {
        let dic;
        if(isGroup)  dic = this.Cgroups;
        else  dic = this.Cusers;
        for (const [key, value] of Object.entries(dic)) {
            if(value.email === email) {
                return true;
            }
        }
        return false;
    }

    isAGroupID(id: string) : boolean {
        return id in this.Cgroups;
    }

    isAUserID(id: string) : boolean {
        return id in this.Cusers;
    }

}