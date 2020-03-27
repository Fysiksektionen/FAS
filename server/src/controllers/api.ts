import { Request, Response } from "express"

import { mockGroupResponse } from '../../../shared/types/GroupNode'
import GroupApi from './GroupApi'
import auth from '../credentials'
import { as } from './asyncUtil'

const groupApi = new GroupApi('fysiksektionen.se', {auth});

export const getGroups = async(req: Request, res: Response) => {
    const [err, groups] = await as(groupApi.listGroups())
    if (err) console.log(err)
    res.json(groups);
}

export const getUsers = async(req: Request, res: Response) => {
    
}

export const getMap = async(req: Request, res: Response) => {
    const [err, map] = await as(groupApi.getMap())
    if (err) console.log(err)
    res.json(map);
}