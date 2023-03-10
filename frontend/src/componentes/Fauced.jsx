import { useEffect,useState } from "react"

export function Fauced(){

    const [adress,setAdress]=useState(0)
    useEffect(()=>{
        window.ethereum.request({
            method:"eth_requestAccounts"

        }).then(cuentas=>{
            setAdress(cuentas[0])
        })
    },[])

    
    return (
    <div className="container">

       <p>{adress}</p>
    </div>
   
    
    )
}