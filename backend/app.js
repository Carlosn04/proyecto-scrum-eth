const express = require('express')
const cors = require("cors")

const app = express()

const network = require('./router/network.js')
const faucet = require('./router/faucet.js')
const balance = require('./router/balance.js')
const chain = require('./router/chain.js')
const config = require('./router/config.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/network", network)
app.use("/faucet", faucet)
app.use("/balance", balance)
app.use("/chain", chain)
app.use("/config", config)

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
    console.log("Listening ", PORT)
})