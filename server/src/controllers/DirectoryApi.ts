
import { admin_directory_v1 } from 'googleapis';
import { as } from './asyncUtil';
import { basicDict } from '../../../shared/types/common';
import { Group, User, Member } from '../../../shared/types/GroupNode';

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
    private readonly defaultGroupFields: (keyof Group)[] = [
        "id",
        "email",
        "name",
        "description",
        "aliases",
        "nonEditableAliases",
        "subGroups",
        "users",
        "externalUsers",
    ];
    private readonly defaultUserFields: (keyof User)[] = [
        "id",
        "primaryEmail",
        "name",
        "isAdmin",
        "lastLoginTime",
        "creationTime",
        "orgUnitPath",
    ];
    private readonly defaultMemberFields: (keyof Member)[] = [
        "id",
        "email",
        "role",
        "delivery_settings",
    ];

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
                    for (const field of this.defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedSubGroup[field] = subGroup[field];
                    }
                    return parsedSubGroup as Member;
                });
                group.users = members.filter(member => member.type === 'USER' && !!this.Cusers[member.id]).map(user => {
                    const parsedUser: Partial<Member> = {};
                    for (const field of this.defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedUser[field] = user[field];
                    }
                    return parsedUser as Member;
                });
                group.externalUsers = members.filter(member => member.type === 'USER' && !this.Cusers[member.id]).map(externalUser => {
                    const parsedExternalUser: Partial<Member> = {};
                    for (const field of this.defaultMemberFields) {
                        //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                        parsedExternalUser[field] = externalUser[field];
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
            for (const field of this.defaultGroupFields) {
                //@ts-ignore - TS doesnt check each iteration, creating unions and intersections
                group[field] = Cgroup[field];
            }
            responseGroups[id] = group as Group;
        }

        const responseUsers: {[id: string]: User} = {};
        for (const id in this.Cusers) {
            const Cuser = this.Cusers[id];
            const user: Partial<User> = {};
            for (const field of this.defaultUserFields) {
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

}