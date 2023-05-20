import { Prisma, user as UserModel } from "@prisma/client"
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
          firstname,
          lastname,
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

  const userList = async (user?: UserModel) => {
    try {
      const selectUsers = Prisma.validator<Prisma.userSelect>()({
        email: !!user,
        lastname: !!user,
        firstname: !!user,
        createdAt: true,
        updatedAt: true,
        isActivated: true,
      })

      const list = await prisma.user.findMany({
        select: selectUsers,
      })

      return list
    } catch (e) {
      throw e
    }
  }

  const changePassword = async ({
    id,
    password,
  }: Pick<UserModel, "id" | "password">) => {
    try {
      const query = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password,
        },
      })

      return query
    } catch (e) {
      throw e
    }
  }

  return {
    register,
    activateAccount,
    userList,
    changePassword,
  }
}
