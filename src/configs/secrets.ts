import { config } from "dotenv"
config()

/**
 * !!
 * We should not set default values in here
 * in real world apps
 */

export const PORT = process.env.PORT ?? 3000
export const SALT = process.env.SALT ?? 10

export const MAILER_USERNAME = process.env.MAILER_USERNAME ?? ""
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD ?? ""
export const MAILER_HOST = process.env.MAILER_HOST ?? ""
export const MAILER_PORT = (process.env.MAILER_PORT as unknown as number) ?? 587

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ""
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? ""
export const VERIFICATION_TOKEN_SECRET =
  process.env.VERIFICATION_TOKEN_SECRET ?? ""
