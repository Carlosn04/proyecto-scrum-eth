import { Link } from "react-router-dom"

export function Nav(){

    return (
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    
                    <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#"><Link to="/crearred" >Crear Red</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#"><Link to="/" >Lista</Link></a>
                        </li>
                       
                        <li class="nav-item">
                            <a class="nav-link" href="#"><Link to="/crearnodos" >Crear nodos</Link></a>
                        </li>
                      
                    </ul>
                    </div>
                </div>
            </nav>

    )
}