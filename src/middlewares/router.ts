import { Express } from "express"
import LoginRoute from "./../routes/auth/main.model"
import UserRoute from "./../routes/user/main.model"

export const router = (app: Express) => {
  app.use("/login", LoginRoute)
  app.use("/user", UserRoute)
}
