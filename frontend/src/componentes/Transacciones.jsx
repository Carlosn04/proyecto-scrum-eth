import { useEffect, useState } from "react"
import '../table.css'

export function Transactions() {
    const [data, setData] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [saldo, setSaldo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showTable, setShowTable] = useState(false); // New state variable to track whether to show the table


    async function getTx() {
        setIsLoading(true)
        const response = await fetch(`http://localhost:3000/chain/transaction/${cantidad}`)
        if (response.status == "200") {
            const datos = await response.json();
            setData(datos.tx)
            await buscarSaldo(datos)
            setIsLoading(false)
            return
        }
    }

    async function buscarSaldo(cuenta) {
        const response = await fetch(`http://localhost:3000/chain/latestBlock`)
        if (response.status == "200") {
            const datos = await response.json();
            setSaldo(datos)
        }
    }

    useEffect(() => {
        const cuenta = "0xa56Ae8B9cFd6BC0D38DB7C6B840961668C24B0B3"
        buscarSaldo(cuenta)
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        const datos = getTx()
        setShowTable(true)
    }
    const net = !saldo.config ? "" : saldo.config.network
    const LB = !saldo.latestBlock ? "" : saldo.latestBlock
    const TX = !data ? "" : data
    //if(LB !== "")
    const blockTable = (
        <table className="block-table">
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(LB).map((key) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{LB[key]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
    const txTable = (
        <table className="block-table">
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(TX).map((key) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{TX[key]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
    return (
        <div className="container">
            <h4>{net}</h4>
            <h5>Último bloque</h5>
            {blockTable}
            <p></p>
            <div></div>
            <h5>Ver Transacción</h5>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Hash:</label>
                </div>
                <input value={cantidad} onChange={(event) => setCantidad(event.target.value)}  style={{ width: '700px', height: '50px' }}/>
                <p></p>
                <button type="submit" className='mt-3 btn btn-primary'>Confirmar</button>
            </form>
            <div>
                {isLoading && <h6>Se esta realizando la tx</h6>}
            </div>
            <label></label>
            {showTable && txTable}
        </div>
    )
}