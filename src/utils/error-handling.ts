import { Prisma, PrismaClient } from "@prisma/client"
import { Response } from "express"

/**
 *
 * @param e error object
 * @param prisma prisma client so we can close the connection whenever there is an exception thrown
 * @param res express `res` object so we can send a response to client whenever there are client exceptions thrown
 * @returns
 */
export const throwException = (
  e: unknown,
  prisma?: PrismaClient,
  res?: Response
) => {
  const err: Error = e as Error

  if (err instanceof Prisma.PrismaClientKnownRequestError && prisma && res) {
    // Duplicate error from prisma
    if (err.code === "P2002") {
      return res
        .status(409)
        .send(
          `Same ${err.meta?.target} is already registered from the database.`
        )
    }

    prisma.$disconnect()
  }

  throw err
}
