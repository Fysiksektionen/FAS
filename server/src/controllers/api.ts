import { Request, Response } from "express"

import { mockGroupResponse } from '../../../shared/types/GroupNode'
import GroupApi from './GroupApi'
import auth from '../credentials'
import { as } from './asyncUtil'

const groupApi = new GroupApi('fysiksektionen.se', {auth});

/**
 * GET /
 * Returns a simple mock group response
 */


export const getGroups = async(req: Request, res: Response) => {
    // return mock response for now since we dont have any model/db in place.
    //res.json(mockGroupResponse)
    const [err, groups] = await as(groupApi.listGroups())
    console.log(err)
    res.json(groups);
    
}