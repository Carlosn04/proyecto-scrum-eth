const express = require('express')
const cors = require("cors")

const app = express()

const network = require('./router/network.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/network", network)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Listening ", PORT)
})