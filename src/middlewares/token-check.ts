import { Response, NextFunction } from "express"
import { verifyToken } from "./../utils/main"
import { TOKEN } from "./../constants"
import { TRequest } from "./../types/dto"
import { user as UserModel } from "@prisma/client"

export const checkToken = (
  req: TRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers && req.headers["authorization"]

  if (!authHeader) return res.sendStatus(401)

  const auth = authHeader.split(" ")

  const [type, token] = [auth[0], auth[1]]

  if (type === TOKEN.TYPE && token) {
    const isTokenValid = verifyToken(token, "access")

    if (isTokenValid) {
      const user: UserModel = isTokenValid as unknown as UserModel

      req.user = user
    }
  }

  next()
}
