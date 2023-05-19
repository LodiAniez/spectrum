import { Request, Response } from "express"

export const AUTH = {
  LOGIN: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
}
