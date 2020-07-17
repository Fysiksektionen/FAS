import { Request, Response } from 'express'
import DirectoryApi from './DirectoryApi'
import auth from '../credentials'
import {primaryDomain, primaryEmailDomain, secondaryEmailDomains, allDomainsEmail} from '../credentials'
import { as } from './asyncUtil'


const directoryApi = new DirectoryApi(primaryDomain, {auth});


export const getMap = async(req: Request, res: Response) => {
    const noChache = req.headers['cache-control'] === 'no-cache';
    const [err, map] = await as(directoryApi.getMap(undefined, noChache));
    if (err) console.log(err);
    res.json(map);
}



export const createGroup = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    // no need to check email available, google does this

    // create group
    const [err, success] = await as(directoryApi.createGroup( {requestBody: req.body} ));
    if(err) { // error while creating group
        console.log(err);
        sendError(res, "Could not create group.", err);
        return;
    }

    // if sucessful, add aliases
    // It adds alias automatically.....
    /*if (!err) { 
        let groupKey = success.id;
        for(let emailDomain in secondaryEmailDomains) {
            const [err2, success2] = await as(directoryApi.addAlias({groupKey: groupKey, alias: emailNoDomain + emailDomain}));
            if(err2) {
                console.log(err2);
                sendError(res, "Could not add alias to group.", error: err2});
                return;
            }
        }
    }*/

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const deleteGroup = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const [err, success] = await as(directoryApi.deleteGroup(req.body)); // {groupKey: groupKey}
    if (err) {
        console.log(err);
        sendError(res, "Could not remove group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const editGroupInfo = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const patch = req.body;
    const groupKey = req.body.groupKey;
    const [err, success] = await as(directoryApi.editGroupInfo({groupKey: req.body.groupKey, requestBody: req.body}));
    if (err) {
        console.log(err);
        sendError(res, "Could not edit group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const addAliasToGroup = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    //let email2 = req.body.email + '@f.kth.se'; // check if automatically adds the secondary ones

    const [err, success] = await as(directoryApi.addAliasToGroup({groupKey: req.body.groupKey, requestBody: {alias: req.body.alias}})); // {groupKey: groupKey, alias: email}
    if (err) {
        console.log(err);
        sendError(res, "Could not add alias to group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const removeAliasFromGroup = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const [err, success] = await as(directoryApi.removeAliasFromGroup(req.body)); // {groupKey: groupKey, alias: email}
    if (err) {
        console.log(err);
        sendError(res, "Could not remove alias from group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const addMember = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const parentKey = req.body.groupKey;
    const child = req.body.member; // {email: X}
    const email = req.body.member.email;
    const [err, success] = await as(directoryApi.addMember({groupKey: parentKey, requestBody: child}, email));
    if (err) {
        console.log(err);
        sendError(res, "Could not add to group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const removeMember = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const parentKey = req.body.groupKey;
    const memberKey = req.body.memberKey; // not email, the actual member.id field
    const [err, success] = await as(directoryApi.removeMember({groupKey: parentKey, memberKey: memberKey}));
    if (err) {
        console.log(err);
        sendError(res, "Could not remove from group.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const editMember = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const parentKey = req.body.groupKey;
    const childID = req.body.memberKey;
    const role = req.body.role;
    const delivery_settings = req.body.delivery_settings;
    const patch:any = {};
    if(role) patch.role = role;
    if(delivery_settings) patch.delivery_settings = delivery_settings;

    const [err, success] = await as(directoryApi.editMember({groupKey: parentKey, memberKey: childID, requestBody: patch}));
    if (err) {
        console.log(err);
        sendError(res, "Could not edit member.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const createUser = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const data = req.body;
    data.password = makeRandomString(24); // make random password
    const [err, success] = await as(directoryApi.createUser(data));
    if (err) {
        console.log(err);
        sendError(res, "Could not create user.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const deleteUser = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const [err, success] = await as(directoryApi.deleteUser(req.body)); // {userKey: email}
    if (err) {
        console.log(err);
        sendError(res, "Could not delete user.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}

export const editUser = async(req: Request, res: Response) => {
    if(!checkUserPermission(req)) {
        makePermissionDeniedResponse(res);
        return;
    }

    const userID = req.body.userID;
    const [err, success] = await as(directoryApi.editUser({userKey: userID, requestBody: req.body}));
    if (err) {
        console.log(err);
        sendError(res, "Could not edit user.", err);
        return;
    }

    // sendSuccess(res, success)
    sendSuccess(res, {}) // don't send anything, we don't need anything.
}


/*const checkIfEmailIsAvailable = async(email: string) : Promise<boolean> => {
    const [err, success] = await as(directoryApi.getGroup({groupKey: email}));
    let error = err as any;
    if(error) {
        if(error.errors[0].message === 'Resource Not Found: groupKey') { // TODO find better way to check for this?
            console.log("error message correct");
            return true;
        }
    }
    return false;
}*/


const makePermissionDeniedResponse = (res: Response) => {
    // TODO
}

const checkUserPermission = (req: Request) : boolean => {
    return true; // TODO
}

function sendSuccess(res: Response, response: any)  {
    // Format:  { success: boolean, error?: { ... }, response?: { } }
    res.json({success: true, response: response});
}

function sendError(res: Response, error_msg: string, error_object: any) {
    // Format:  { success: boolean, error?: { ... }, response?: { } }
    res.json({success: false, error: {error_msg: error_msg, error: error_object} });
}


function makeRandomString(length: number): string {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
