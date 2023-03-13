import { useQuery, useMutation } from "react-query"
import { Link } from "react-router-dom"
import { useState } from "react"

import { Nodos } from "./Nodos"
import { set } from "react-hook-form"

import fs from "fs"



const listaNetwork = async () => {
    const response = await fetch("http://localhost:3000/network")
    const datos = await response.json();
    console.log(datos)
    return datos;
}

async function crearConfig(red){
    const number = parseInt(red.replace(/[^\d]/g, ""));
    const response = await fetch(`http://localhost:3000/network/${number}`)
    const datos = await response.json()
    const PORT = datos[0].http_port
    const CHAIN_ID = datos[0].chainId
    const NETWORK = red
    const create_config = await fetch(`http://localhost:3000/config/${NETWORK}/${PORT}/${CHAIN_ID}`)
    alert('Se ha conectado la red!')

    // const jsonBlob = new Blob([JSON.stringify(faucet_config, null, 2)], { type: 'application/json' })
    // const jsonUrl = URL.createObjectURL(jsonBlob)
    // const downloadLink = document.createElement('a')
    // downloadLink.href = jsonUrl
    // downloadLink.download = 'faucetconfig.json'
    // downloadLink.click()
    console.log(NETWORK, PORT, CHAIN_ID)
}

export const Lista = () => {  
    
    const [mensaje, setMensaje] = useState("")    
    const [networkNodo,setNetworkNodo]=useState(null)

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
        window.location.reload()        
    }
    
    const Listanodos=(nodos)=>{
        setNetworkNodo(nodos)
        
    }
    const { data, isLoading } = useQuery(["redes"], listaNetwork)
    if (isLoading) return <p>Cargando</p>
    return <div>
        
        <h3>Lista de redes</h3>
        


        <Link   to ="/crearred/">Nueva Red</Link>
        <table className="table">
            <thead>
                <tr>
                    
                    <th>numero</th>
                    <th>chainId</th>
                    <th>cuenta</th>
                    
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
                        
                       
                        <td>
                           
                            <button className="btn btn-danger" 
                                
                                onClick={() => borrar(item.numero)}>BorrarRed</button>

                            
                        </td>
                            
                        <td>
                            
                                <button className="btn btn-warning" onClick={()=>Listanodos(item.numero)}
                                >Lista Nodos</button>
                            
                        </td>

                        <td>
                            
                                <button className="btn btn-primary" onClick={()=> crearConfig(item.numero)}
                                >Conectar</button>
                            
                        </td>
                    </tr>)
                   
                }
            </tbody>
             
              
         
        </table>
        {networkNodo&& <Nodos valor={networkNodo}></Nodos>}
        
       
                
               
    </div>
   
     
    
}