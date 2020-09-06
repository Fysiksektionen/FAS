import mongoose, { Types } from 'mongoose';
import { PermsType } from "../controllers/permissions"


// define interface for the object.
interface IPermsUser {
    username: string;
    assignedGroupsID: string[];
    assignedUserID: string[];
    type: PermsType;
}
// a type with the values as their types in IPermsUser
const TPermsUser = { 
    username: String, // email id.
    assignedGroupsID: [String],  // [{ type: String }]
    assignedUserID: [String],
    type: PermsType, // is this even correct?
}


// document types that contains the perms user stuff
export interface IPermsUserDocument extends mongoose.Document, IPermsUser {}

// model with a build function for the documents
interface IPermsUserFactory {
    build(attributes: IPermsUser): IPermsUserDocument;
}
interface IPermsUserModel extends mongoose.Model<IPermsUserDocument>, IPermsUserFactory {}

// define schema of the object. has to contian IPermsUser fields
const permsUserSchema = new mongoose.Schema(TPermsUser);

// to make an instance use PermsUserModel.build
const PermsUserModel = mongoose.model<IPermsUserDocument, IPermsUserModel>('permsUser', permsUserSchema);

permsUserSchema.statics.build = (permUser: IPermsUser) : IPermsUserDocument => {
    return new PermsUserModel(permUser);
}

// export the factory
export const PermsUserFactory : IPermsUserFactory = {build: PermsUserModel.build};
