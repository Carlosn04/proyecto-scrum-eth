const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const { exec, spawn, execSync, spawnSync } = require("child_process")

const PASSWORD = process.env.PASSWORD
const MICUENTA = process.env.MICUENTA
const BALANCE = process.env.BALANCE

function crearDirSiNoExiste(path){
    if(!fs.existsSync(path)) 
    fs.mkdirSync(path)
    console.log(`Se ha creado el directorio ${path}`)
    return
}

function borrarDirSiExiste(path){
    if(fs.existsSync(path)){ 
     fs.rm(path, { recursive: true })
     console.log(`Se ha borrado el directorio ${path}`)
    }
}

function generarParametros(network, node) {
    const NUMERO_NETWORK = parseInt(network)
    const NUMERO_NODO = parseInt(node)
    const NODO = `nodo${NUMERO_NODO}`
    const NETWORK_DIR = `ETH/eth${NUMERO_NETWORK}`
    const NETWORK_CHAINID = 222333 + NUMERO_NETWORK

    const HTTP_PORT = 9545 + NUMERO_NODO + NUMERO_NETWORK * 20
    const DIR_NODE = `${NETWORK_DIR}/${NODO}`
    const IPCPATH = `\\\\.\\pipe\\${NETWORK_CHAINID}-${NODO}.ipc`
    const PORT = 30404 + NUMERO_NODO + NUMERO_NETWORK * 20
    const AUTHRPC_PORT = 9553 + NUMERO_NODO + NUMERO_NETWORK * 20

    // const logFile = {
    //     NUMERO_NETWORK: NUMERO_NETWORK, 
    //     NUMERO_NODO: NUMERO_NODO, 
    //     NODO: NODO,
    //     NETWORK_DIR: NETWORK_DIR,
    //     NETWORK_CHAINID: NETWORK_CHAINID,
    //     HTTP_PORT: HTTP_PORT,
    //     DIR_NODE: DIR_NODE,
    //     IPCPATH: IPCPATH,
    //     PORT: PORT,
    //     AUTHRPC_PORT: AUTHRPC_PORT
    // }

    // console.log(logFile)
    return {
        NUMERO_NETWORK, NUMERO_NODO, NODO, NETWORK_DIR, NETWORK_CHAINID, HTTP_PORT,
        DIR_NODE, IPCPATH, PORT, AUTHRPC_PORT
    }
}

function crearCuenta(DIR_NODE, PASSWORD) {
    fs.writeFileSync(`${DIR_NODE}/pwd`, PASSWORD)
    execSync(`geth  --datadir ${DIR_NODE}  account new --password ${DIR_NODE}/pwd`)

    // pillamos el address que hemos creado 
    const lista = fs.readdirSync(`${DIR_NODE}/keystore`)
    const CUENTA = JSON.parse(fs.readFileSync(`${DIR_NODE}/keystore/${lista[0]}`).toString()).address
    return CUENTA
}

async function generarArchivoGenesis(){
    const genesisFile = {
        "config": {
          "chainId": 222333,
          "homesteadBlock": 0,
          "eip150Block": 0,
          "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eip155Block": 0,
          "eip158Block": 0,
          "byzantiumBlock": 0,
          "constantinopleBlock": 0,
          "petersburgBlock": 0,
          "istanbulBlock": 0,
          "clique": {
            "period": 0,
            "epoch": 30000
          }
        },
        "nonce": "0x0",
        "timestamp": "0x63ee5f2f",
        "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000a56ae8b9cfd6bc0d38db7c6b840961668c24b0b30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "gasLimit": "0x47b760",
        "difficulty": "0x1",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "alloc": {},
        "number": "0x0",
        "gasUsed": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "baseFeePerGas": null
      }
      genesisFile.alloc[`${MICUENTA}`] = {
          "ballance": BALANCE
      }
    fs.writeFileSync('genesisbase.json', JSON.stringify(genesisFile, null, 4))
}

async function generarGenesis(NETWORK_CHAINID, CUENTA, BALANCE, CUENTAS_ALLOC, NETWORK_DIR) {
    const timestamp = Math.round(((new Date()).getTime() / 1000)).toString(16)
    // leemos la plantilla del genesis
    if(!fs.existsSync('genesisbase.json')){
       await generarArchivoGenesis()
    }
    let genesis = JSON.parse(fs.readFileSync('genesisbase.json').toString())

    // genesis.timestamp = `0x${timestamp}`
    genesis.config.chainId = NETWORK_CHAINID
    genesis.extraData = `0x${'0'.repeat(64)}${CUENTA}${'0'.repeat(130)}`


    genesis.alloc = CUENTAS_ALLOC.reduce((acc, item) => {
        acc[item] = { balance: BALANCE }
        return acc
    }, {})

    fs.writeFileSync(`${NETWORK_DIR}/genesis.json`, JSON.stringify(genesis))
}

function lanzarNodo(NUMERO_NETWORK, NUMERO_NODO, DIR_NODE, NETWORK_DIR,
    IPCPATH, NETWORK_CHAINID, HTTP_PORT, CUENTA, PORT,
    AUTHRPC_PORT, BALANCE,
    CUENTAS_ALLOC) {

    const out2 = fs.openSync(`./${DIR_NODE}/outNodo.log`, 'a');
    const err2 = fs.openSync(`./${DIR_NODE}/outNodo.log`, 'a');
    const params = [
        "--networkid", NETWORK_CHAINID,
        '--mine',
        '--syncmode', 'full',
        '--datadir', DIR_NODE,
        "--http.addr", "0.0.0.0",
        '--http', '--http.corsdomain', '*', '--graphql',
        '--http.port', HTTP_PORT, '--http.api', 'clique,admin,eth,miner,net,txpool,personal,web3',
        '--allow-insecure-unlock', '--unlock', CUENTA, '--password', `${DIR_NODE}/pwd`,
        '--port', PORT,
        '--authrpc.port', AUTHRPC_PORT,
        '--ipcpath', IPCPATH,
        '--nodiscover',
        '--trace', `${DIR_NODE}/trace.txt`
    ]

    const nodo = {
        network: NUMERO_NETWORK,
        nodo: NUMERO_NODO,
        network_dir: NETWORK_DIR,
        dir_node: DIR_NODE,
        port: PORT,
        http_port: HTTP_PORT,
        ipcpath: IPCPATH,
        address: CUENTAS_ALLOC,
        chainId: NETWORK_CHAINID,
        authRpcPort: AUTHRPC_PORT,
        prefund: BALANCE

    }
    const subproceso2 = spawn('geth', params, { detached: true, stdio: ['ignore', out2, err2] });
    fs.writeFileSync(`${DIR_NODE}/paramsNodo.json`, JSON.stringify({ nodo, subproceso: subproceso2 }, null, 4))
    subproceso2.unref();
    return { nodo, subproceso: subproceso2 }
}



module.exports = { crearDirSiNoExiste, borrarDirSiExiste, generarParametros, crearCuenta, generarGenesis, lanzarNodo }

// geth 
// --datadir ${NODO} init genesis.json
// --networkid ${NETWORK_CHAINID}
// --syncmode full --datadir ${DIR_NODE}
// --http -–graphql --http.port ${HTTP_PORT} --http.api admin,eth,miner,net,txpool,personal,web3
// --allow-insecure-unlock --unlock `0x${CUENTA}`
// --password ${PASSWORD}
// --port ${PORT}