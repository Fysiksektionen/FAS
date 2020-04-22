
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

export type GroupNodeResponse = CommonGroup & {
	subGroups: string[],
	users: string[],
}

export type GroupNode = CommonGroup & {
	subGroups: GroupNode[],
	users: User[],
}

export interface TreeItem {
	name?: string,
	attributes?: {
		[key: string]: string,
	};
	children?: TreeItem[],
	_collapsed?: boolean
};
