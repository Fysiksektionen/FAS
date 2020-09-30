interface CommonGroup {
	id: string,
	email: string,
	name: string,
	description: string,
	aliases: string[],
	nonEditableAliases: string[],
}
export interface User {
	id: string,
	primaryEmail: string,
	name: {
		givenName: string,
		familyName: string,
		fullName: string
    },
	isAdmin: boolean,
	lastLoginTime: string,
	creationTime: string,
	orgUnitPath: string,
}
export interface Member {
	id: string,
	email: string,
    role: string,
    delivery_settings: string
}
export interface Group extends CommonGroup {
	subGroups: Member[],
	users: Member[],
	externalUsers: Member[],
	parents?: string[],
}

export interface GroupFilled extends CommonGroup {
	subGroups: GroupFilled[],
    users: User[],
    externalUsers: Member[]
}

export interface DirectoryMap {
    groups: { [id: string]: Group }
    users: { [id: string]: User }
}

export interface TreeItem {
	name?: string,
	attributes?: {
		[key: string]: string,
	};
	children?: TreeItem[],
	_collapsed?: boolean
};
