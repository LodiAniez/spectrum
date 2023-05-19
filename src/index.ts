import express, { Express } from "express"
import { PORT } from "./configs/secrets"

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))
