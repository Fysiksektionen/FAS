import { Request, Response } from 'express'
import DirectoryApi from './DirectoryApi'
import auth from '../credentials'
import { as } from './asyncUtil'



const directoryApi = new DirectoryApi('fysiksektionen.se', {auth});



export const getMap = async(req: Request, res: Response) => {
    const noChache = req.headers['cache-control'] === 'no-cache';
    const [err, map] = await as(directoryApi.getMap(undefined, noChache));
    if (err) console.log(err);
    res.json(map);
}
