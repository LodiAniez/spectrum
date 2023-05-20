import { Response, NextFunction } from "express"
import { verifyToken } from "./../utils/main"
import { TOKEN } from "./../constants"
import { TRequest } from "./../types/dto"
import { User as UserModel } from "@prisma/client"
import { useHooks } from "./../routes/auth/hooks"

const { checkAuthToken } = useHooks()

export const authGuard = async (
  req: TRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers && req.headers["authorization"]

  if (!authHeader) return res.sendStatus(401)

  const auth = authHeader.split(" ")

  const [type, token] = [auth[0], auth[1]]

  if (type !== TOKEN.TYPE || !token) return res.sendStatus(401)

  const isTokenValid = verifyToken(token, "access")

  if (!isTokenValid) return res.sendStatus(401)

  const user: UserModel = isTokenValid as unknown as UserModel

  const isLoggedIn = await checkAuthToken({ id: user.id })

  if (!isLoggedIn) return res.sendStatus(403)

  const { authToken } = isLoggedIn

  const decodeRefreshToken = verifyToken(authToken!, "refresh") // `authToken` should be defined since we already have filtered it from query

  if (!decodeRefreshToken) return res.sendStatus(403)

  if ((decodeRefreshToken as unknown as UserModel).id !== user.id)
    return res.sendStatus(403)

  req.user = user

  next()
}
