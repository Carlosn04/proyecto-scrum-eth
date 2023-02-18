const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')

const { crearDirSiNoExiste, borrarDirSiExiste, generarParametros, crearCuenta, generarGenesis, lanzarNodo } = require('../funciones')

module.exports = router

const { exec } = require("child_process")
const { send } = require('process')

const PASSWORD = process.env.PASSWORD
const MICUENTA = process.env.MICUENTA
const BALANCE = process.env.BALANCE

router.get("/", async (req, res) => {
    crearDirSiNoExiste("ETH")
    const redes = fs.readdirSync("ETH", { withFileTypes: true }).filter(i => !i.isFile())
    const output = redes.map(i => {
        if (!fs.existsSync(`ETH/${i.name}/genesis.json`))
            return null
        const genesis = JSON.parse(fs.readFileSync(`ETH/${i.name}/genesis.json`))
        const cuentas = Object.keys(genesis.alloc)
        return { numero: i.name, chainid: genesis.config.chainId, cuentas: cuentas }
    }
    ).filter(i => i!= null)
    res.send(output)
})

router.get("/create/:network/:node", async (req, res) => {

    const NUMERO_NETWORK = parseInt(req.params.network)
    const NUMERO_NODO = parseInt(req.params.node)

    const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH } = generarParametros(NUMERO_NETWORK, NUMERO_NODO)

    crearDirSiNoExiste("ETH")
    borrarDirSiExiste(NETWORK_DIR)
    crearDirSiNoExiste(NETWORK_DIR)
    crearDirSiNoExiste(DIR_NODE)
    // console.log(DIR_NODE, PASSWORD)
    // return res.send("ok")

    const CUENTA = await crearCuenta(DIR_NODE, PASSWORD)
    const CUENTAS_ALLOC = [
        CUENTA,
        MICUENTA
    ]

    await generarGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)
    return res.send("OK")

    // INICIALIZAMOS EL NODO
    const comando = `geth --datadir ${DIR_NODE} init ${NETWORK_DIR}/genesis.json`

    const result = exec(comando, (error, stdout, stderr) => {
        console.log("ejecutado")
        if (error) {
            res.send({ error })
            return
        }
        const resultado = launchNode(NUMERO_NETWORK, NUMERO_NODO, DIR_NODE,
            NETWORK_DIR, IPCPATH, NETWORK_CHAINID,
            HTTP_PORT, CUENTA, PORT, AUTHRPC_PORT, BALANCE, CUENTAS_ALLOC)

        res.send(resultado)
    })
})



