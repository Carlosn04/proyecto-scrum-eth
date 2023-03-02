import { useQuery, useMutation } from "react-query"
import { Link } from "react-router-dom"
import { useState } from "react"



const listaNetwork = async () => {
    const response = await fetch("http://localhost:3000/network")
    const datos = await response.json();
    console.log(datos)
    return datos;
}





export const Lista = () => {
    const [mensaje, setMensaje] = useState("")
   
    const sendServer = async (network) => {
        console.log(network)
        const response = await fetch(`http://localhost:3000/network/${network}`,
            {
                method: "DELETE",
            }
        )
        const datosResponse = await response.json()
        setMensaje(JSON.stringify(datosResponse))
        
        console.log(datosResponse)
       
    }
    const mutation = useMutation(sendServer)

    const borrar = (network) => {
        console.log("network a eliminar", network)
        mutation.mutate(network)
        
        
    }

    const { data, isLoading } = useQuery(["redes"], listaNetwork)

 
    if (isLoading) return <p>Cargando</p>
    return <div>
        <h3>Lista de redes</h3>
        <Link   to ="/crearred">Nueva Red</Link>
        <table className="table">
            <thead>
                <tr>
                    
                    <th>numero</th>
                    <th>chainId</th>
                    <th>cuenta</th>
                    <th></th>
                    <th></th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => <tr key={index}>
                        
                        <td>{item.numero}</td>
                        <td>{item.chainid}</td>
                        <td>{item.cuentas.map((cuenta, index2) => <div key={index2}>{cuenta}</div>)}</td>
                        <td><button className="btn btn-danger" 
                                onClick={() => borrar(item.numero)}>BorrarRed</button></td>
                        <td><button className="btn btn-secondary" >CrearNodo</button></td>
                        <td><button className="btn btn-warning" >ListarNodos</button></td>
                    </tr>)
                }
            </tbody>

              
         
        </table>
    </div>
}