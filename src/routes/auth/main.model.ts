import { Router } from "express"
import { AUTH } from "./main.controller"

const router: Router = Router()

router.post("/", AUTH.LOGIN)

export default router
