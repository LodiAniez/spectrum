import { Router } from "express"
import { USER } from "./main.controller"

const router: Router = Router()

router.post("/register", USER.REGISTER)

router.get("/activate/:token", USER.ACTIVATE)

router.get("/list", USER.LIST)

router.put("/change-password", USER.CHANGE_PASSWORD)

export default router
