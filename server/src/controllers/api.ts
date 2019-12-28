import { Request, Response } from "express"
import {GroupNodeResponse, mockGroupResponse} from '../../../shared/types/GroupNode'

/**
 * GET /
 * Returns a simple mock group response
 */
export const getGroups = (req: Request, res: Response) => {
    // return mock response for now since we dont have any model/db in place.
    res.json(mockGroupResponse)
}