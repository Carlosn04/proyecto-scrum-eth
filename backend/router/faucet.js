const express = require('express')
const router = express.Router()

const Web3 = require("web3")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config()

module.exports = router

//const json = JSON.parse(fs.readFileSync("../ETH/eth1/nodo2/keystore/UTC--2023-03-12T22-14-14.454198700Z--74c3b720cea6887182cc75b126ee2b0c4c6e76df").toString("utf-8"))
//const account = web3.eth.accounts.decrypt(process.env.PRIVATE_KEY, process.env.PASSWORD);

/*const tx = {
    to: "0x514Bf575cC08571Fb0327c9F72fb5Ea15e163D13",
    from: account.address,
    gas: 30000,
    value: web3.utils.toWei("5",'ether')
}
account.signTransaction(tx).then(tx1 => {
    console.log(tx1.rawTransaction)
    web3.eth.sendSignedTransaction(tx1.rawTransaction).then(i => {
        console.log(i)
    })
})*/

router.get("/:cuenta/:cantidad", async (req, res) => {
    const faucet_config = fs.readFileSync(`faucetconfig.json`)
    const config = JSON.parse(faucet_config)
    try {
        const web3 = new Web3(`http://127.0.0.1:${config.port}`)
        const amount = web3.utils.toWei(`${req.params.cantidad}`, 'ether')
        const txInfo = {
            to: req.params.cuenta,
            from: process.env.MICUENTA,
            value: amount,
            gas: 30000
        }

        const tx = await web3.eth.accounts.signTransaction(txInfo, process.env.PRIVATE_KEY)

        const txSend = await web3.eth.sendSignedTransaction(tx.rawTransaction)
        //console.log(txSend)
        // enviar el nuevo saldo
        const balance = await web3.eth.getBalance(req.params.cuenta)
        res.send({ balance, config })
    } catch (err) {
        return res.send(err)
    }
})