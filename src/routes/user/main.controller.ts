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
import { User as UserModel } from "@prisma/client"
import { UserListResponseDto } from "./dto/user-list.dto"
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from "./dto/change-password.dto"

interface DecodedTokenEmail extends Pick<UserModel, "email"> {}

const { register, activateAccount, userList, changePassword } = useHooks()

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
  CHANGE_PASSWORD: async (
    req: TRequest<ChangePasswordDto>,
    res: TResponse<ChangePasswordResponseDto>
  ) => {
    try {
      // `req.user` should now be defined
      const user = req.user!

      if (!user.id) return res.status(400).send("Data is invalid")
      if (!req.body.password)
        return res.status(400).send("New password is required.")

      const hashedPassword = await hashPassword(req.body.password)

      const result = await changePassword({
        id: user.id,
        password: hashedPassword,
      })

      res.status(200).json({
        success: !!result,
      })
    } catch (e) {
      throwException(e, res)
    }
  },
  LIST: async (req: TRequest, res: TResponse<UserListResponseDto>) => {
    try {
      const user = req.user

      const list = await userList(user)

      res.status(200).json({
        list,
      })
    } catch (e) {
      throwException(e, res)
    }
  },
}
