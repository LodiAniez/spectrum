import express, { Express } from "express"
import { PORT } from "./configs/secrets"
import { router } from "./middlewares/router"

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
router(app)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
