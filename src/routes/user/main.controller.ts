import { Request, Response } from "express"
import { TRequest, TResponse } from "./../../types/dto"
import { RegisterUserDto } from "./dto/register-user.dto"
import { useHooks } from "./hooks"
import { throwException } from "./../../utils/error-handling"
import {
  hashPassword,
  encodeToken,
  sendEmail,
  verifyToken,
} from "./../../utils/main"
import { user as UserModel } from "@prisma/client"

interface DecodedTokenEmail extends Pick<UserModel, "email"> {}

const { register, activateAccount } = useHooks()

export const USER = {
  REGISTER: async (
    req: TRequest<RegisterUserDto>,
    res: TResponse<Omit<UserModel, "password">>
  ) => {
    try {
      if (!Object.keys(req.body).length)
        return res.status(400).send("Payload is missing.")

      if (!req.body.email || !req.body.password)
        return res.status(400).send("Email and password is required.")

      const { password, email } = req.body

      const hashedPassword = await hashPassword(password)

      const data = await register({
        ...req.body,
        password: hashedPassword,
      })

      // generate a token for verification
      const verificationToken = encodeToken(data, "verification")

      // Send verification email, we won't wait for this to resolve
      sendEmail(email, verificationToken)

      // We don't send the password to FE even if it is hashed
      const { password: pass, ...rest } = data

      res.status(200).json(rest)
    } catch (e) {
      throwException(e, res)
    }
  },
  ACTIVATE: async (
    req: TRequest<never, { token: string }>,
    res: TResponse<Omit<UserModel, "password">>
  ) => {
    try {
      if (!req.params.token) return res.status(400).send("Token is missing.")

      const { token } = req.params
      const decodedToken = verifyToken(token, "verification")

      if (!decodedToken)
        return res.status(400).send("Token is invalid or has expired.")

      const { email }: DecodedTokenEmail = decodedToken as DecodedTokenEmail

      const data = await activateAccount(email)

      const { password, ...rest } = data

      res.status(200).json(rest)
    } catch (e) {
      throwException(e, res)
    }
  },
  CHANGE_PASSWORD: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
  LIST: (_req: Request, res: Response) => {
    res.sendStatus(200)
  },
}
