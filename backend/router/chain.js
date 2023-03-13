const express = require('express')
const router = express.Router()

const Web3 = require("web3")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

module.exports = router

router.get("/latestBlock", async (req, res) => {
    try {
    const web3 = new Web3(`http://127.0.0.1:9566`)
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);
    const secondLatestBlock = await web3.eth.getBlock(latestBlockNumber - 1);
    const thirdLatestBlock = await web3.eth.getBlock(latestBlockNumber - 2);
    const block = [ latestBlock, secondLatestBlock, thirdLatestBlock ]
    res.send({ block })
    } catch(err){
        res.send(err)
    }
})