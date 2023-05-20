import { User as UserModel } from "@prisma/client"

export interface ChangePasswordDto extends Pick<UserModel, "password"> {}

export interface ChangePasswordResponseDto {
  success: boolean
}
