import { hash, compare } from "bcrypt"
import { SignOptions, sign, verify } from "jsonwebtoken"
import {
  SALT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  VERIFICATION_TOKEN_SECRET,
  MAILER_USERNAME,
} from "./../configs/secrets"
import { TOKEN } from "./../constants"
import { transporter } from "./../configs/mailer"

type TokenPurpose = "access" | "refresh" | "verification"

const setTokenSecret = (purpose: TokenPurpose) => {
  return purpose === "access"
    ? ACCESS_TOKEN_SECRET
    : purpose === "verification"
    ? VERIFICATION_TOKEN_SECRET
    : REFRESH_TOKEN_SECRET
}

export const hashPassword = async (password: string) => {
  try {
    return hash(password, Number(SALT))
  } catch (e) {
    throw e
  }
}

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    const isCorrect = await compare(plainPassword, hashedPassword)

    return isCorrect
  } catch (e) {
    return null
  }
}

export const encodeToken = (data: any, purpose: TokenPurpose) => {
  const secret = setTokenSecret(purpose)

  /**
   * Refresh token doesn't have expiry, we'll use this to refresh user's access
   * We will manually revoke the access of this token when user logs out from the system
   * by simply removing it from db
   */
  const options: SignOptions | undefined =
    purpose === "refresh" ? undefined : { expiresIn: TOKEN.EXPIRY }

  return sign(data, secret, options)
}

export const verifyToken = (token: string, tokenFor: TokenPurpose) => {
  const secret = setTokenSecret(tokenFor)

  try {
    return verify(token, secret)
  } catch (e) {
    return null
  }
}

export const sendEmail = (receiver: string, token: string) => {
  transporter
    .sendMail({
      from: MAILER_USERNAME,
      to: receiver,
      subject: "Account Activation",
      html: `
      <div style="padding: 10px; border: 1px solid #cccccc; border-radius: 10px">
        <p>Congratulations! You have registered successfully! Please click this <a href="http://localhost:3000/user/activate/${token}">link</a> to verify your account. This link will expire in 1 day.</p>
      </div>
    `,
    })
    .then(() => console.log("Email sent."))
    .catch((e) => console.error("Email not sent.", e))
}
