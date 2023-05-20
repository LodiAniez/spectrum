import { prisma } from "./../../configs/prisma"
import { user as UserModel } from "@prisma/client"

export const useHooks = () => {
  const login = async (email: string): Promise<UserModel | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      return user
    } catch (e) {
      throw e
    }
  }

  const setAuthToken = async (
    email: string,
    authToken: string
  ): Promise<void> => {
    try {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          authToken,
        },
      })
    } catch (e) {
      throw e
    }
  }

  const checkAuthToken = async ({ id }: Pick<UserModel, "id">) => {
    try {
      const result = await prisma.user.findFirst({
        where: {
          id,
          AND: {
            authToken: {
              not: null,
            },
          },
        },
        select: {
          authToken: true,
        },
      })

      return result
    } catch (e) {
      throw e
    }
  }

  return {
    login,
    setAuthToken,
    checkAuthToken,
  }
}
