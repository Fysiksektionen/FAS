
import { admin_directory_v1 } from 'googleapis';
import { as } from './asyncUtil';
import { basicDict } from '../../../shared/types/common';
import { GroupNodeResponse, User } from '../../../shared/types/GroupNode';

type cGroup = admin_directory_v1.Schema$Group & {
    subGroups: string[];
    users: string[];
}
type cUser = admin_directory_v1.Schema$Member

export default class DirectoryApi extends admin_directory_v1.Admin {
    
    private Cgroups: {[id: string]: cGroup};
    private Cusers: {[id: string]: cUser};
    private cached: boolean = false;
    private readonly def = {
        domain: this.domain,
        maxResults: 200,
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
        opts = {...this.def, ...opts};

        if (!this.cached || noCache) {
            const [err, groups] = await as(this.listGroups(opts));
            if (err) return Promise.reject(err);

            const memberPromises = groups.map(async (group: Partial<cGroup>) => {
                const [err2, members] = await as(this.listMembers(group.id));
                if (err2 || !members) return Promise.reject(err2);
                
                group.subGroups = members.filter(member => member.type === 'GROUP').map(subGroup => subGroup.id);
                group.users = members.filter(member => member.type === 'USER').map(user => user.id);
                return Promise.resolve(group as cGroup);
            });
            const [errAll, mappedGroups] = await as(Promise.all(memberPromises));
            if (errAll) return Promise.reject({mesg: "listMembers", error: errAll});
            
            for (const group of mappedGroups) {
                this.Cgroups[group.id] = group;
            }
            this.cached = true;
        }

        return {
            groups: this.Cgroups as {[id: string]: GroupNodeResponse},
            users: {} // Add if needed
        };
    }

    public async listGroups(opts?: basicDict) : Promise<admin_directory_v1.Schema$Group[]> {
        opts = {...this.def, ...opts};

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
        opts = {...this.def, ...opts, groupKey};

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

    public async getUsers(groupKey: string, opts?: basicDict) {
        // TODO
    }

}