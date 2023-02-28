Fran 14-02-2023 22:03:Descriptiva del proyecto backend

CUENTA = 0xa56Ae8B9cFd6BC0D38DB7C6B840961668C24B0B3

geth 
--datadir ${NODO} init genesis.json
--networkid ${NETWORK_CHAINID}
--syncmode full --datadir ${DIR_NODE}
--http -–graphql --http.port ${HTTP_PORT} --http.api admin,eth,miner,net,txpool,personal,web3
--allow-insecure-unlock --unlock "0x${CUENTA}"
--password ${DIR_NODE}/pwd
--port ${PORT}