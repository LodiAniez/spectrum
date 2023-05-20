import { User as UserModel } from "@prisma/client"

export interface RegisterUserDto
  extends Pick<UserModel, "email" | "password" | "firstname" | "lastname"> {}
