import { useEffect,useState } from "react"

export function Faucet() {
    const [cuenta, setCuenta] = useState(null)
    const [cantidad, setCantidad] = useState("")
    const [saldo, setSaldo] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function enviarEth() {
        setIsLoading(true)
        const response = await fetch(`http://localhost:3000/faucet/${cuenta}/${cantidad}`)
        if (response.status == "200") {
            const datos = await response.json();
            await buscarSaldo(cuenta)
            setIsLoading(false)
        }
    }

    async function buscarSaldo(cuenta) {
        const response = await fetch(`http://localhost:3000/balance/${cuenta}`)
        if (response.status == "200") {
            const datos = await response.json();
            console.log(datos)
            setSaldo(datos)
        }
    }

    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(cuentas => {
          setCuenta(cuentas[0])
          buscarSaldo(cuentas[0])
    
    
          ethereum.on("accountsChanged", (cuentas) => {
            setCuenta(cuentas[0])
            buscarSaldo(cuentas[0])
          })
        });
    
      }, [])



      function handleSubmit(event) {
        event.preventDefault()
        enviarEth()
      }
      const net = !saldo.config ? "" : saldo.config.network
      return (
        <div className="container">
          <h4>{net}</h4>
          <h5>Cuenta</h5>
          <label>{cuenta}</label>
          <p></p>
          <h5>Saldo</h5> 
          <div>{JSON.stringify(Number(saldo.formatBalance))} ETH</div>
          <p></p>
          <div></div>
          <h5>Solicitar ETH</h5>
          <form onSubmit={handleSubmit}>
            <div>
            <label>Cantidad</label>
            </div>
            <input type="number" value={cantidad} onChange={(event) => setCantidad(event.target.value)} />
            <p></p>
            <button type="submit" className='mt-3 btn btn-primary'>Enviar</button>
          </form>
          <div>
          {isLoading && <h6>Se esta realizando la tx</h6>}
          </div>
        </div>
      )

    return (
    <div className="container">
      <div>Cuenta {cuenta}</div>
      <div>Saldo = {JSON.stringify(saldo)}</div>
      {!isLoading && <button onClick={() => enviarEth()} className='mt-3 btn btn-primary'>Enviar</button>}
      {isLoading && <div>Se esta realizando la tx</div>}
    </div>
  )

    /*useEffect(() => {
        window.ethereum.request({
            method: "eth_requestAccounts"

        }).then(cuentas => {
            setAdress(cuentas[0])
        })
    }, [])*/


    /*return (
        <div className="container">

            <p>{adress}</p>
        </div>
    )*/
}