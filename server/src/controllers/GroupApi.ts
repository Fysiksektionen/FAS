
import { admin_directory_v1 } from 'googleapis';
import { as } from './asyncUtil';
import { basicDict } from '../../../shared/types/common';
import Graph from './Graph';

type cGroup = admin_directory_v1.Schema$Group & {
    subGroups?: string[];
    users?: string[];
}
type cUser = admin_directory_v1.Schema$Member

export default class GroupApi extends admin_directory_v1.Admin {
    
    private Cgroups: {[id: string]: cGroup};
    private Cusers: {[id: string]: cUser};
    private readonly def = {
        domain: this.domain,
        maxResults: 200,
    };

    constructor(public domain: string, opts: Partial<admin_directory_v1.Options>) {
        //const admin = google.admin("directory_v1");
        super({version: 'directory_v1', ...opts});
        this.Cgroups = {};
        this.Cusers = {};
    }

    public async getMap(opts?: basicDict) {
        opts = {...this.def, ...opts};

        const [err, groups] = await as(this.listGroups(opts));
        if (err) return Promise.reject(err);

        const memberPromises = groups.map(async group => {
            const [err2, members] = await as(this.listMembers(group.id));
            if (err2) return Promise.reject(err2);
            group.subGroups = members.filter(member => member.type === 'GROUP').map(subGroup => subGroup.id);
            group.users = members.filter(member => member.type === 'USER').map(user => user.id);
        });
        const [errAll, ] = await as(Promise.all(memberPromises));
        if (errAll) return Promise.reject(errAll);
        return {
            groups: this.Cgroups,
            users: {} // Add if needed
        };
    }

    public async listGroups(opts?: basicDict): Promise<cGroup[]> {
        opts = {...this.def, ...opts};

        const [err, res] = await as(this.groups.list(opts));
        if (err) return Promise.reject(err);

        const groups = res.data.groups;
        for (const group of groups) {
            this.Cgroups[group.id] = group;
        }
        if (res.data.nextPageToken) {
            const [err, nextGroups] = await as(this.listGroups({...opts, pageToken: res.data.nextPageToken}));
            if (err) return Promise.reject(err);
            groups.push(...nextGroups);
        }
        return groups;
    }

    public async getGroup(groupKey: string, opts?: basicDict) {
        opts = {...this.def, ...opts, groupKey};

        const [err, res] = await as(this.groups.get(opts));
        if (err) return Promise.reject(err);
        const group = res.data;
        this.Cgroups[group.id] = group;
        return group;
    }

    public async listMembers(groupKey: string, opts?: basicDict): Promise<admin_directory_v1.Schema$Member[]> {
        opts = {...this.def, ...opts, groupKey};

        const [err, res] = await as(this.members.list(opts));
        if (err) return Promise.reject(err);

        const members = res.data.members;
        
        if (res.data.nextPageToken) {
            const [err, nextMembers] = await as(this.listMembers(groupKey, {...opts, pageToken: res.data.nextPageToken}));
            if (err) return Promise.reject(err);
            members.push(...nextMembers);
        }
        return members;
    }

    public async getSubGroups(groupKey: string, opts?: basicDict) {
        const [err, res] = await as(this.listMembers(groupKey, opts));
        if (err) return Promise.reject(err);

        return res.filter((member) => member.type === 'GROUP');
    }

    public async getUsers(groupKey: string, opts?: basicDict) {
        const [err, res] = await as(this.listMembers(groupKey, opts));
        if (err) return Promise.reject(err);

        const users = res.filter((member) => member.type === 'USER');
        for (const user of users) {
            this.Cusers[user.id] = user;
        }
        return users;
    }

}