import { User as UserModel } from "@prisma/client"
import { TOKEN } from "../../../constants"

export interface LoginDto extends Pick<UserModel, "email" | "password"> {}

export interface LoginDtoResponse {
  accessToken: string
  expiresIn: TOKEN.EXPIRY
  type: TOKEN.TYPE
}
