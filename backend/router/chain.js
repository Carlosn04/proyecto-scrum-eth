const express = require('express')
const router = express.Router()

const Web3 = require("web3")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

module.exports = router

router.get("/latestBlock", async (req, res) => {
    const faucet_config = fs.readFileSync(`faucetconfig.json`)
    const config = JSON.parse(faucet_config)
    try {
    const web3 = new Web3(`http://127.0.0.1:${config.port}`)
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);
    const secondLatestBlock = await web3.eth.getBlock(latestBlockNumber - 1);
    const thirdLatestBlock = await web3.eth.getBlock(latestBlockNumber - 2);
    const block = [ latestBlock, secondLatestBlock, thirdLatestBlock ]
    res.send({ config, latestBlock })
    } catch(err){
        res.send(err)
    }
})

router.get("/transaction/:data", async (req, res) => {
    const faucet_config = fs.readFileSync(`faucetconfig.json`)
    const config = JSON.parse(faucet_config)
    try {
    const web3 = new Web3(`http://127.0.0.1:${config.port}`)
    const tx = await web3.eth.getTransaction(req.params.data);
    res.send({ tx })
    } catch(err){
        res.send(err)
    }
})