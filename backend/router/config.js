const express = require('express')
const router = express.Router()

const Web3 = require("web3")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

module.exports = router

router.get("/:network/:port/:chain", async (req, res) => {
    try {
    const faucet_config = {
        network: req.params.network,
        port: req.params.port,
        chainId: req.params.chain
    }
    fs.writeFileSync('faucetconfig.json', JSON.stringify(faucet_config, null, 2))

    res.send({ faucet_config })
    } catch(err){
        res.send(err)
    }
})