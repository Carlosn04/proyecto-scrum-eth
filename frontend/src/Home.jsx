
import { Footer } from "./componentes/Footer"
import { Headers } from "./componentes/Header"
import {Outlet} from "react-router-dom"

export function Home(){

    return (
        <div className="container">
        
            <div><Headers></Headers></div>
            <hr />
            <div><Outlet></Outlet></div>
            <hr />
            <div><Footer></Footer></div>
        
        </div>
    )
}

