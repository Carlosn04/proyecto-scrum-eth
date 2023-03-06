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

// TODAS LAS REDES Y CUENTAS EN EL GENESIS
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



// TODOS LOS NODOS DE UNA RED
router.get("/:network", async (req, res) => {
    const NUMERO_NETWORK = parseInt(req.params.network)
    const NETWORK_DIR = `ETH/eth${NUMERO_NETWORK}`
    const nodos = fs.readdirSync(NETWORK_DIR, { withFileTypes: true }).filter(i => !i.isFile())
    const output = nodos.map(i => JSON.parse(fs.readFileSync(`${NETWORK_DIR}/${i.name}/paramsNodo.json`)).nodo)
    res.send(output)
})


//BORRAR UNA RED

router.delete("/:network", async (req, res) => {
    
    const NETWORK = req.params.network;
    
    const NETWORK_DIR = `ETH/${NETWORK}`
    const nodos = fs.readdirSync(NETWORK_DIR, { withFileTypes: true }).filter(i => !i.isFile())
    const pids = nodos.map(i => {
        try {
            return JSON.parse(fs.readFileSync(`${NETWORK_DIR}/${i.name}/paramsNodo.json`)).subproceso.pid
        } catch (error) {
            console.log(error)
            return null
        }

    })

    pids.filter(i => i !== null).forEach(i => {
        try {
            process.kill(i, 0)
            process.kill(i, 'SIGTERM')
            
        } catch (error) {
            console.log(error)
        }
    })
    
    fs.rmSync(NETWORK_DIR, {recursive: true, force:true}) // se añade en linux force para forzar sudo permisos
    res.send({ network: req.params.network })
})


// CREAR UN NODO DENTRO DE UNA RED
router.get("/add/:network/:node", async (req, res) => {

    const NUMERO_NETWORK = parseInt(req.params.network)
    const NUMERO_NODO = Number(req.params.node)


    const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH } = generarParametros(NUMERO_NETWORK, NUMERO_NODO)

    crearDirSiNoExiste("ETH")
    // borrarDirSiExiste(NETWORK_DIR)
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

    // INICIALIZAMOS EL NODO
    const comando = `geth --datadir ${DIR_NODE} init ${NETWORK_DIR}/genesis.json`

    exec(comando, (error, stdout, stderr) => {
        console.log(`${DIR_NODE} ha sido ejecutado`)
        if (error) {
            res.send({ error })
            return
        }
        const resultado = lanzarNodo(NUMERO_NETWORK, NUMERO_NODO, DIR_NODE,
            NETWORK_DIR, IPCPATH, NETWORK_CHAINID,
            HTTP_PORT, CUENTA, PORT, AUTHRPC_PORT, BALANCE, CUENTAS_ALLOC)

        res.send(resultado)
    })
})

// CREAR VARIOS NODOS DENTRO DE UNA RED
router.post("/create", async (req, res) => {

    const NUMERO_NETWORK = parseInt(req.body.network)
    const NUMERO_NODO = parseInt(req.body.node)
    crearDirSiNoExiste("ETH")

    for (let i = 0; i < NUMERO_NODO; i++) {

        const numeroNodo = i + 1
        const { NETWORK_DIR, DIR_NODE, NETWORK_CHAINID, AUTHRPC_PORT, HTTP_PORT, PORT, IPCPATH } = generarParametros(NUMERO_NETWORK, numeroNodo)

        borrarDirSiExiste(DIR_NODE)
        crearDirSiNoExiste(NETWORK_DIR)
        crearDirSiNoExiste(DIR_NODE)

        const CUENTA = await crearCuenta(DIR_NODE, PASSWORD)
        const CUENTAS_ALLOC = [
            CUENTA,
            MICUENTA
        ]

        await generarGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR)

        // INICIALIZAMOS EL NODO
        const comando = `geth --datadir ${DIR_NODE} init ${NETWORK_DIR}/genesis.json`

        exec(comando, (error, stdout, stderr) => {
            console.log(`${DIR_NODE} ha sido ejecutado`)
            if (error) {
                //res.send({ error })
                return
            }
            const resultado = lanzarNodo(NUMERO_NETWORK, i, DIR_NODE,
                NETWORK_DIR, IPCPATH, NETWORK_CHAINID,
                HTTP_PORT, CUENTA, PORT, AUTHRPC_PORT, BALANCE, CUENTAS_ALLOC)

            //res.send(resultado)
        })
    }
    res.end()
    return
})