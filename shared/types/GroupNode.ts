
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
	email: string,
	name: {
		givenName: string,
		familyName: string,
		fullName: string
	},
	role?: string,
	type: string,
	status?: string,
	isAdmin: boolean,
	lastLoginTime: string,
	creationTime: string,
	orgUnitPath: string,
}

export interface GroupNodeResponse extends CommonGroup {
	subGroups: string[],
	users: string[],
}

export interface GroupNode extends CommonGroup {
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
