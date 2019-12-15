import { Request, Response } from "express"

/**
 * GET /
 * Returns a simple json object to say hello
 */
export const helloworld = (req: Request, res: Response) => {
    res.json({message: "Hello fdev!"})
}