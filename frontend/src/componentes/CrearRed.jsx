
import {useForm} from "react-hook-form"
import { useMutation } from 'react-query';
import {useState} from "react"
import { Link } from "react-router-dom";

export function CrearRed(){
    
    const [mensaje,setMensaje]=useState("")
    const enviarExpress=async(datos)=>{

        const respuesta=await fetch("http://localhost:3000/network/create",{
            method:"POST",
            body:JSON.stringify(datos),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const datosResponse = await respuesta.json()
        setMensaje(JSON.stringify(datosResponse))
        console.log(datosResponse)
        

        
    } 
    const mutation = useMutation(enviarExpress)

    
    const submit=(data)=>{
        mutation.mutate(data)
        console.log("hol",data)
    }

    
    const{register,handleSubmit}=useForm()
    return (
    
        
    

    <div className="container">
        {mensaje != "" ? <p  className='alert alert-danger'>{mensaje}</p> : ""}
        <h2>Creacion de la red Eth:</h2>
        <h4>Formulario Red Eth</h4>


        <form onSubmit={handleSubmit((data)=>submit(data))}>

            <div>

                <label>Cuenta</label>
                <input className="form-control" defaultValue="0xa56Ae8B9cFd6BC0D38DB7C6B840961668C24B0B3" {...register('cuenta',{required:true})}/>

            </div>

             <div>

                <label>Numero Red</label>
                <input className="form-control" defaultValue="1" {...register('network',{required:true})}/>

            </div>
            <div>

                <label>Numero Nodos</label>
                <input className="form-control" defaultValue="1" {...register('node',{required:true})}/>

            </div>
            
            <input type="submit" value="Crear" className="mt-3 btn btn-primary"/>


        </form>
    </div>
   
    
    )
}