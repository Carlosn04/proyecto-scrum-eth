const express = require('express')
const router = express.Router()

const Web3 = require("web3")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

module.exports = router

router.get("/:cuenta", async (req, res) => {
    try {
    const web3 = new Web3(`http://127.0.0.1:9566`)
    const balance = await web3.eth.getBalance(req.params.cuenta)
    const formatBalance = await web3.utils.fromWei(balance, 'ether')
    res.send({ formatBalance })
    } catch(err){
        res.send(err)
    }
})