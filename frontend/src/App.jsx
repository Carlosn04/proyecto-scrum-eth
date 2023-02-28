import {BrowserRouter,Routes,Route,} from 'react-router-dom'
import { Home } from './Home'
import { CrearRed } from './componentes/CrearRed'
<<<<<<< HEAD
import { Logos } from './componentes/Logos'
=======
import { Lista } from './componentes/Lista'
>>>>>>> 62cdf86 (front parte2)
import { Privacidad } from './componentes/Privacidad'

import { QueryClient, QueryClientProvider } from 'react-query'


const queryClient=new QueryClient()
export function App(){

    return (
    <QueryClientProvider client={queryClient}>


    
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home></Home>}>
                    <Route path="/crearRed" element={<CrearRed></CrearRed>} ></Route>
                    <Route path="/privacidad" element={<Privacidad></Privacidad>} ></Route>
<<<<<<< HEAD
                    <Route path="/logos" element={<Logos></Logos>} ></Route>
=======
                    <Route path="/lista" element={<Lista></Lista>} ></Route>
>>>>>>> 62cdf86 (front parte2)
                </Route>

            </Routes>
        </BrowserRouter>
        
    </QueryClientProvider>
    )
}