
import { admin_directory_v1 } from 'googleapis';
import { as } from './asyncUtil';
import { basicDict } from '../../../shared/types/common';

export default class GroupApi extends admin_directory_v1.Admin {
    
    private Cgroups: {[idx: string]: admin_directory_v1.Schema$Group};
    private Cmembers: {[idx: string]: admin_directory_v1.Schema$Member};
    private readonly def = {
        domain: this.domain,
        maxResults: 200,
    };
    private readonly idxPropG = 'id'; // id or name
    private readonly idxPropM = 'id'; // id or email

    constructor(public domain: string, opts: Partial<admin_directory_v1.Options>) {
        //const admin = google.admin("directory_v1");
        super({version: 'directory_v1', ...opts});
        this.Cgroups = {};
        this.Cmembers = {};
    }

    public async listGroups(opts?: basicDict): Promise<admin_directory_v1.Schema$Group[]> {
        opts = {...this.def, ...opts};

        const [err, res] = await as(this.groups.list(opts));
        if (err) return Promise.reject(err);

        const groups = res.data.groups;
        for (const group of groups) {
            this.Cgroups[group[this.idxPropG]] = group;
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
        this.Cgroups[group[this.idxPropG]] = group;
        return group;
    }

    public async listMembers(groupKey: string, opts?: basicDict): Promise<admin_directory_v1.Schema$Member[]> {
        opts = {...this.def, ...opts, groupKey};

        const [err, res] = await as(this.members.list(opts));
        if (err) return Promise.reject(err);

        const members = res.data.members;
        for (const member of members) {
            this.Cmembers[member[this.idxPropM]] = member;
        }
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

        return res.filter((member) => member.type === 'USER');
    }

}