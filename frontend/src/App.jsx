import {BrowserRouter,Routes,Route,} from 'react-router-dom'
import { Home } from './Home'
import { Somos } from './componentes/Somos'
import { Logos } from './componentes/Logos'
import { Privacidad } from './componentes/Privacidad'
export function App(){

    return (

        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home></Home>}>
                <Route path="/somos" element={<Somos></Somos>} ></Route>
                <Route path="/privacidad" element={<Privacidad></Privacidad>} ></Route>
                <Route path="/logos" element={<Logos></Logos>} ></Route>
            </Route>

        </Routes>
        </BrowserRouter>
        
    
    )
}