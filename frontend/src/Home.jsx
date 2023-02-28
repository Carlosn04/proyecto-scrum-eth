
import { Footer } from "./componentes/Footer"
import { Headers } from "./componentes/Header"
import {Outlet} from "react-router-dom"
import {Nav} from "./componentes/Nav"

export function Home(){

    return (
        <div className="container">
        
            <div><Headers></Headers></div>
            
            <div><Nav></Nav></div>
        
            <div><Outlet></Outlet></div>
            <hr />
            <div><Footer></Footer></div>
        
        </div>
    )
}

