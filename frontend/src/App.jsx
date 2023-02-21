import {BrowserRouter,Routes,Route,} from 'react-router-dom'
import { Home } from './Home'
import { CrearRed } from './componentes/CrearRed'
import { Logos } from './componentes/Logos'
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
                    <Route path="/logos" element={<Logos></Logos>} ></Route>
                </Route>

            </Routes>
        </BrowserRouter>
        
    </QueryClientProvider>
    )
}