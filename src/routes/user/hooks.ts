import { user as UserModel } from "@prisma/client"
import { RegisterUserDto } from "./dto/register-user.dto"
import { prisma } from "./../../configs/prisma"

export const useHooks = () => {
  const register = async (user: RegisterUserDto): Promise<UserModel> => {
    try {
      const { email, password, firstname, lastname } = user

      const data = await prisma.user.create({
        data: {
          email,
          password,
          firstname: firstname ?? null,
          lastname: lastname ?? null,
        },
      })

      return data
    } catch (e) {
      throw e
    }
  }

  const activateAccount = async (email: string) => {
    try {
      const data = await prisma.user.update({
        where: {
          email,
        },
        data: {
          isActivated: true,
        },
      })

      return data
    } catch (e) {
      throw e
    }
  }

  return {
    register,
    activateAccount,
  }
}
