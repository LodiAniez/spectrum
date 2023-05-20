import { Router } from "express"
import { USER } from "./main.controller"
import { checkToken } from "./../../middlewares/token-check"
import { authGuard } from "./../../middlewares/auth-guard"

const router: Router = Router()

router.post("/register", USER.REGISTER)

router.get("/activate/:token", USER.ACTIVATE)

router.get("/list", checkToken, USER.LIST)

router.put("/change-password", authGuard, USER.CHANGE_PASSWORD)

export default router
