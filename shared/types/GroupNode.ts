
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
	externalUsers: Member[]
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

export interface DirectoryAPIResponse {
	success: boolean,
	error?: DirectoryAPIError,
	reponse?: any // not used right now
}

interface DirectoryAPIError {
	error_msg: string, // custom message
	error: any // google error object
}