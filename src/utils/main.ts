import { hashSync } from "bcrypt"
import { sign } from "jsonwebtoken"
import {
  SALT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MAILER_USERNAME,
} from "./../configs/secrets"
import { TOKEN_EXPIRY } from "./../constants"
import { transporter } from "./../configs/mailer"

type TokenPurpose = "access" | "refresh" | "verification"

export const hashPassword = (password: string) => {
  return hashSync(password, Number(SALT))
}

export const encodeToken = (data: any, purpose: TokenPurpose) => {
  if (purpose === "access" || purpose === "verification") {
    return sign(data, ACCESS_TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY })
  }

  return sign(data, REFRESH_TOKEN_SECRET)
}

export const sendEmail = (receiver: string, token: string) => {
  transporter
    .sendMail({
      from: MAILER_USERNAME,
      to: receiver,
      html: `
      <div style="padding: 10px; border: 1px solid #cccccc; border-radius: 10px">
        <p>Congratulations! You have registered successfully! Please click this <a href="http://localhost:3000/user/activate/${token}">link</a> to verify your account.</p>
      </div>
    `,
    })
    .then(() => console.log("Email sent."))
    .catch((e) => console.error("Email not sent.", e))
}
