import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/restaurants", restaurants) // main route, EVERY ROUTE start with this
app.use("*",(req, res) => res.status(404).json({error:"not found"})) // if route is not listed in restaurants.route.js, display error 404 and message

export default app