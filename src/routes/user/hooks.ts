import { PrismaClient, user as User } from "@prisma/client"
import { RegisterUserDto } from "./dto/register-user.dto"

export const useHooks = (prisma: PrismaClient) => {
  const register = async (user: RegisterUserDto): Promise<User> => {
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

      prisma.$disconnect()
      return data
    } catch (e) {
      throw e
    }
  }

  return {
    register,
  }
}
