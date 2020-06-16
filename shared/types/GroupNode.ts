
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
	isAdmin: boolean,
	lastLoginTime: string,
	creationTime: string,
	orgUnitPath: string,
}

export interface Member {
    id: string,
    role: string,
    delivery_settings: string
}

export interface Group extends CommonGroup {
	subGroups: Member[],
	users: Member[],
}

// export interface GroupNodeResponse extends CommonGroup {
// 	subGroups: string[],
// 	users: string[],
// }

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
