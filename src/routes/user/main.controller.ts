import { Request, Response } from "express"

export const USER = {
  REGISTER: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
  ACTIVATE: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
  CHANGE_PASSWORD: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
  LIST: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
}
