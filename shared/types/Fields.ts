import { Group, User, Member } from "./GroupNode";

    export const defaultGroupFields: (keyof Group)[] = [
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
    export const defaultUserFields: (keyof User)[] = [
        "id",
        "primaryEmail",
        "name",
        "isAdmin",
        "lastLoginTime",
        "creationTime",
        "orgUnitPath",
    ];
    export const defaultMemberFields: (keyof Member)[] = [
        "id",
        "email",
        "role",
        "delivery_settings",
    ];

    export const allowedGroupFields = [
        "id",
        "email",
        "name",
        "description",
    ];
    export const allowedUserFields = [
        "id",
        "primaryEmail",
        "name",
    ];
    export const allowedMemberFields = [
        "id",
        "email",
        "role",
        "delivery_settings",
    ];