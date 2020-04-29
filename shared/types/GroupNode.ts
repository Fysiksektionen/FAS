
interface CommonGroup {
	id: string,
	email: string,
	name: string,
	description: string,
	nonEditableAliases: string[],
}

export interface User {
	id: string,
	email: string,
	name: {fullName: string},
	role: string,
	type: string,
	status: string,
	isAdmin: boolean,
	lastLoginTime: string,
	creationTime: string,
	orgUnitPath: string,
}

export type Group = CommonGroup & {
	subGroups: string[],
	users: string[],
}

export type GroupWithChildren = CommonGroup & {
	subGroups: GroupWithChildren[],
	users: User[],
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
