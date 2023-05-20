import { user as UserModel } from "@prisma/client"

export interface UserListResponseDto {
  list: Partial<UserModel>[] | null
}
