import { createTransport } from "nodemailer"
import {
  MAILER_USERNAME,
  MAILER_PASSWORD,
  MAILER_HOST,
  MAILER_PORT,
} from "./secrets"

export const transporter = createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  secure: false,
  auth: {
    user: MAILER_USERNAME,
    pass: MAILER_PASSWORD,
  },
})
