


import { useQuery, useMutation } from "react-query"
import { Link,useParams } from "react-router-dom"
import { useState } from "react"



export function Nodos(props){
    
    
    const [mensaje, setMensaje] = useState("")
    const addNodoServer = async(network)=>{

        console.log("carlos",network)
        const response=await fetch(`http://localhost:3000/network/add/${network.network}/${network.nodo}`)
        const datosResponse= await response.json()
        setMensaje(datosResponse)

        
    }
    const mutation = useMutation(addNodoServer)
    
    
    const Añadir = (network,nodo) => {
        console.log("añadiendo nodo a la red:", network,nodo)
        mutation.mutate({ network, nodo })
        
        
    }
    //const { data, isLoading } = useQuery(["redes"], Nodos)
    //const {data1,isloading1}=useQuery(["nodos"],Nodos)
    //console.log(data)
    //if(isloading) return <p>Cargando1</p>
    //return <div 
    
    //clasName="container">
            //{data.map((item, index) =>
                //<p>{item.numero}</p>

            //)}
       
       
       //<p>{numero}</p>
    //</div>
    
    
    
    //const params = useParams()
    const newstring=props.valor.substring(3)
    
    //const newstring=params.id.substring(3)
    const listaNodos = async () => {
        const response = await fetch(`http://localhost:3000/network/${newstring}`)
        const data1 = await response.json();
        console.log(data1)
        return data1;
    }
   
    const { data, isLoading } = useQuery(["Nodos"], listaNodos)
   
    console.log("en el componente",data)
    if (isLoading) return <div>Cargando</div>
    return  <div>
        <h1>Lista de nodos creados</h1>
        <p>RedEth{data[0].network}</p>
        
            <ul>
                {
                    data.map((item,index)=><li key={index}>Nodo {item.nodo}</li>)
                }
                
            </ul>
            {console.log("longitud",Object.keys(data).length)}
        <div><button className="btn btn-warning" onClick={()=>Añadir(data[0].network,data.length+1)} >Crear nodo</button></div>
       
               
    </div>
    
    
    

} 
