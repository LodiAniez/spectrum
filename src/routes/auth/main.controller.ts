import { LoginDto, LoginDtoResponse } from "./dto/login.dto"
import { useHooks } from "./hooks"
import { throwException } from "../../utils/error-handling"
import { TRequest, TResponse } from "./../../types/dto"
import { comparePassword, encodeToken } from "./../../utils/main"
import { TOKEN } from "./../../constants"

const { login, setAuthToken } = useHooks()

export const AUTH = {
  LOGIN: async (req: TRequest<LoginDto>, res: TResponse<LoginDtoResponse>) => {
    try {
      if (!req.body.email || !req.body.password)
        return res.status(400).send("Email and password is required.")

      const { email, password: plainPassword } = req.body

      const user = await login(email)

      if (!user) return res.status(404).send("User not found.")

      if (!user.isActivated)
        return res
          .status(403)
          .send(
            "This account is not activated yet, please click the link sent to your email to activate your account."
          )

      // If activated, compare password
      const isPasswordCorrect = await comparePassword(
        plainPassword,
        user.password
      )

      if (!isPasswordCorrect)
        return res.status(401).send("Password is incorrect.")

      /**
       * Generate `accessToken` and `refreshToken` for this user
       */
      const [accessToken, refreshToken] = [
        encodeToken(user, "access"),
        encodeToken(user, "refresh"),
      ]

      setAuthToken(email, refreshToken)

      res.status(200).json({
        accessToken,
        expiresIn: TOKEN.EXPIRY,
        type: TOKEN.TYPE,
      })
    } catch (e) {
      throwException(e, res)
    }
  },
}
